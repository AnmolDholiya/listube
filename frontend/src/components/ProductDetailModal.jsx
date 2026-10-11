import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { StatusStamp } from './StatusStamp';
import { 
  X, 
  Image as ImageIcon, 
  UploadCloud, 
  CheckCircle2, 
  AlertOctagon, 
  Send, 
  RefreshCw, 
  FileCode2, 
  CheckCheck,
  AlertTriangle,
  RotateCcw,
  Layers,
  ArrowRight,
  Zap
} from 'lucide-react';

export const ProductDetailModal = ({ product, onClose, onRefresh }) => {
  // Navigation Tabs: 'all' | 'images' | 'fields' | 'readiness' | 'sync'
  const [activeTab, setActiveTab] = useState(
    product.status === 'REJECTED' ? 'readiness' : 'all'
  );

  // Step 1 State: Images
  const [imageFiles, setImageFiles] = useState([]);
  const [imageUploading, setImageUploading] = useState(false);
  const [imageErrors, setImageErrors] = useState([]);
  const [imageSuccess, setImageSuccess] = useState(false);

  // Step 2 State: Flipkart Extension Fields
  const [hsn, setHsn] = useState('');
  const [procurementType, setProcurementType] = useState('REGULAR');
  const [shippingProvider, setShippingProvider] = useState('FLIPKART');
  const [savingFields, setSavingFields] = useState(false);
  const [fieldSuccess, setFieldSuccess] = useState(false);

  // Step 3 State: Validation / Readiness
  const [validating, setValidating] = useState(false);
  const [validationResult, setValidationResult] = useState(null);

  // Step 4 State: Publish & Polling & Retry
  const [publishing, setPublishing] = useState(false);
  const [publishStatus, setPublishStatus] = useState(product.status || 'DRAFT');
  const [publishBatchInfo, setPublishBatchInfo] = useState(null);
  const [publishErrorMessage, setPublishErrorMessage] = useState(product.errorMessage || null);

  // Multi-Channel Sync State
  const [channelSyncInfo, setChannelSyncInfo] = useState(null);
  const [loadingSync, setLoadingSync] = useState(false);
  const [simulatingOrder, setSimulatingOrder] = useState(false);
  const [orderSimulationMsg, setOrderSimulationMsg] = useState(null);

  useEffect(() => {
    checkReadiness();
    fetchChannelStatus();
  }, [product.id]);

  const fetchChannelStatus = async (overrideStatus = null) => {
    setLoadingSync(true);
    try {
      const res = await api.getChannelSyncStatus(product.id);
      if (res) {
        setChannelSyncInfo(res);
        if (res.channels) {
          const fk = res.channels.find((c) => c.channel === 'FLIPKART');
          if (fk) {
            if (overrideStatus) {
              setPublishStatus(overrideStatus);
            } else if (fk.status) {
              setPublishStatus(fk.status);
            }
            if (fk.errorMessage) {
              setPublishErrorMessage(fk.errorMessage);
            }
          }
        }
      }
    } catch (err) {
      console.warn('Could not fetch channel sync status on mount:', err);
    } finally {
      setLoadingSync(false);
    }
  };

  // Step 1: Upload Images
  const handleImageUpload = async (e) => {
    e.preventDefault();
    if (!imageFiles || imageFiles.length === 0) return;

    setImageUploading(true);
    setImageErrors([]);
    setImageSuccess(false);

    const formData = new FormData();
    Array.from(imageFiles).forEach((f) => formData.append('images', f));

    try {
      await api.uploadImages(product.id, formData);
      setImageSuccess(true);
      setImageFiles([]);
      await checkReadiness();
      await fetchChannelStatus();
      if (onRefresh) onRefresh();
    } catch (err) {
      if (err.data && err.data.details) {
        setImageErrors(err.data.details);
      } else {
        setImageErrors([{ filename: 'Upload', error: err.message || 'Image upload failed' }]);
      }
    } finally {
      setImageUploading(false);
    }
  };

  // Step 2: Save Flipkart Channel Fields
  const handleSaveFields = async (e) => {
    e.preventDefault();
    setSavingFields(true);
    setFieldSuccess(false);

    const fieldsMap = {
      hsn: hsn.trim(),
      procurement_type: procurementType,
      shipping_provider: shippingProvider,
    };

    try {
      await api.upsertChannelFields(product.id, 'FLIPKART', fieldsMap);
      setFieldSuccess(true);
      await checkReadiness();
      await fetchChannelStatus();
      if (onRefresh) onRefresh();
    } catch (err) {
      alert(err.message || 'Failed to save channel fields');
    } finally {
      setSavingFields(false);
    }
  };

  // Step 3: Check Readiness
  const checkReadiness = async () => {
    setValidating(true);
    try {
      const res = await api.validateListing(product.id, 'FLIPKART');
      setValidationResult(res);
      if (res.valid && publishStatus === 'DRAFT') {
        setPublishStatus('VALIDATED');
      }
    } catch (err) {
      console.error('Readiness check error:', err);
    } finally {
      setValidating(false);
    }
  };

  // Polling helper for async batches
  const pollBatchStatus = (batchId) => {
    let pollCount = 0;
    const maxPolls = 60;
    const pollIntervalMs = 2000;

    const pollStatus = async () => {
      try {
        const statusRes = await api.getPublishStatus(batchId);
        setPublishBatchInfo(statusRes);

        if (statusRes.status === 'COMPLETED') {
          const itemResult = statusRes.results?.find((r) => r.productId === product.id || r.sku === product.sku);
          const finalStatus = itemResult?.status || 'PUBLISHED';
          setPublishStatus(finalStatus);
          if (itemResult?.errorMessage) {
            setPublishErrorMessage(itemResult.errorMessage);
          } else {
            setPublishErrorMessage(null);
          }
          setPublishing(false);
          await fetchChannelStatus();
          if (onRefresh) onRefresh();
        } else if (statusRes.status === 'FAILED') {
          setPublishStatus('REJECTED');
          setPublishErrorMessage(statusRes.errorMessage || 'Batch publish failed');
          setPublishing(false);
          await fetchChannelStatus('REJECTED');
          if (onRefresh) onRefresh();
        } else {
          // Still PENDING / IN_PROGRESS
          setPublishStatus('PENDING');
          pollCount++;
          if (pollCount < maxPolls) {
            setTimeout(pollStatus, pollIntervalMs);
          } else {
            setPublishing(false);
          }
        }
      } catch (pollErr) {
        console.error('Polling publish status error:', pollErr);
        setPublishing(false);
      }
    };

    setTimeout(pollStatus, pollIntervalMs);
  };

  // Step 4: Publish to Flipkart
  const handlePublish = async () => {
    setPublishing(true);
    setPublishErrorMessage(null);
    setPublishStatus('PENDING');

    try {
      const res = await api.publishProducts('FLIPKART', [product.id]);
      if (!res || !res.batchId) {
        throw new Error('No batch ID returned from publish initiation');
      }
      setPublishBatchInfo(res);
      pollBatchStatus(res.batchId);
    } catch (err) {
      setPublishStatus('REJECTED');
      setPublishErrorMessage(err.data?.error || err.message || 'Publish operation failed');
      setPublishing(false);
      await fetchChannelStatus('REJECTED');
    }
  };

  // Step 4 (Retry): Retry Publish after fixing gaps
  const handleRetryPublish = async () => {
    setPublishing(true);
    setPublishErrorMessage(null);
    setPublishStatus('PENDING');

    try {
      const res = await api.retryPublish(product.id, 'FLIPKART');
      if (!res || !res.batchId) {
        throw new Error('No batch ID returned from retry publish');
      }
      setPublishBatchInfo(res);
      pollBatchStatus(res.batchId);
    } catch (err) {
      setPublishStatus('REJECTED');
      setPublishErrorMessage(err.data?.error || err.message || 'Retry publish failed');
      setPublishing(false);
      await fetchChannelStatus('REJECTED');
    }
  };

  // Simulate incoming marketplace order to test live propagation
  const handleSimulateOrder = async () => {
    setSimulatingOrder(true);
    setOrderSimulationMsg(null);
    try {
      const response = await fetch('http://localhost:8081/flipkart/orders/simulate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sku: product.sku, quantity: 1 })
      });
      const data = await response.json().catch(() => ({}));
      if (response.ok) {
        setOrderSimulationMsg(`Order simulated! Quantity: 1 unit deducted. Syncing...`);
        setTimeout(async () => {
          await fetchChannelStatus();
          if (onRefresh) onRefresh();
        }, 1500);
      } else {
        setOrderSimulationMsg(`Simulation error: ${data.error || 'Failed'}`);
      }
    } catch (err) {
      setOrderSimulationMsg(`Could not connect to Mock Flipkart on port 8081: ${err.message}`);
    } finally {
      setSimulatingOrder(false);
    }
  };

  const isReadyToPublish = validationResult && validationResult.valid === true;

  return (
    <div className="modal-overlay">
      <div className="ledger-sheet w-full max-w-4xl p-6 relative max-h-[92vh] flex flex-col rounded-sm">
        {/* Header Manifest */}
        <div className="border-b border-[#1B2A4A]/20 pb-4 mb-4">
          <div className="flex items-start justify-between">
            <div className="space-y-1">
              <div className="flex items-center gap-3">
                <span className="font-mono font-bold text-xs px-2 py-0.5 rounded bg-[#1B2A4A] text-white">
                  {product.sku}
                </span>
                <h2 className="text-xl font-display font-bold text-[#1B2A4A]">
                  {product.title}
                </h2>
                <StatusStamp status={publishStatus} />
              </div>
              <div className="text-xs text-[#1B2A4A]/70 font-body flex items-center gap-4">
                <span>Category: <strong className="text-[#1B2A4A]">{product.category}</strong></span>
                <span>MRP: <strong className="font-mono text-[#1B2A4A]">₹{Number(product.mrp).toFixed(2)}</strong></span>
                <span>Selling Price: <strong className="font-mono text-[#1B2A4A]">₹{Number(product.sellingPrice).toFixed(2)}</strong></span>
                <span>Stock: <strong className="font-mono text-[#1B2A4A]">{channelSyncInfo?.currentStock ?? product.stock}</strong></span>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-1 rounded text-[#1B2A4A]/60 hover:text-[#1B2A4A] hover:bg-[#EEF0EA]"
              title="Close Modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Navigation Tabs */}
          <div className="flex items-center gap-2 mt-4 pt-2 border-t border-[#1B2A4A]/10 text-xs">
            <button
              type="button"
              onClick={() => setActiveTab('all')}
              className={`px-3 py-1.5 rounded font-medium transition-colors ${
                activeTab === 'all'
                  ? 'bg-[#1B2A4A] text-white'
                  : 'text-[#1B2A4A]/70 hover:bg-[#EEF0EA]'
              }`}
            >
              All Sections
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('images')}
              className={`px-3 py-1.5 rounded font-medium transition-colors ${
                activeTab === 'images'
                  ? 'bg-[#1B2A4A] text-white'
                  : 'text-[#1B2A4A]/70 hover:bg-[#EEF0EA]'
              }`}
            >
              1. Images
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('fields')}
              className={`px-3 py-1.5 rounded font-medium transition-colors ${
                activeTab === 'fields'
                  ? 'bg-[#1B2A4A] text-white'
                  : 'text-[#1B2A4A]/70 hover:bg-[#EEF0EA]'
              }`}
            >
              2. Flipkart Fields
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('readiness')}
              className={`px-3 py-1.5 rounded font-medium flex items-center gap-1.5 transition-colors ${
                activeTab === 'readiness'
                  ? 'bg-[#C98A2B] text-white font-bold'
                  : 'text-[#1B2A4A]/70 hover:bg-[#EEF0EA]'
              }`}
            >
              <span>3 & 4. Readiness & Publish</span>
              {publishStatus === 'REJECTED' && (
                <span className="w-2 h-2 rounded-full bg-[#B3402A] animate-ping" />
              )}
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('sync')}
              className={`px-3 py-1.5 rounded font-medium flex items-center gap-1.5 transition-colors ${
                activeTab === 'sync'
                  ? 'bg-[#2E7D4F] text-white font-bold'
                  : 'text-[#1B2A4A]/70 hover:bg-[#EEF0EA]'
              }`}
            >
              <Zap className="w-3.5 h-3.5" />
              <span>Multi-Channel Sync</span>
            </button>
          </div>
        </div>

        {/* Numbered Steps Body */}
        <div className="overflow-y-auto flex-1 space-y-6 pr-1">
          {/* STEP 1: IMAGE GALLERY & UPLOAD */}
          {(activeTab === 'all' || activeTab === 'images') && (
            <section className="ledger-sheet-subtle p-4 rounded border border-[#1B2A4A]/15 space-y-3">
              <div className="flex items-center justify-between border-b border-[#1B2A4A]/10 pb-2">
                <div className="flex items-center gap-2">
                  <span className="step-number">1</span>
                  <h3 className="font-display font-bold text-sm text-[#1B2A4A]">
                    Upload Product Images
                  </h3>
                </div>
                <span className="text-xs text-[#1B2A4A]/60 font-mono">
                  Min 2 images • ≥500x500px • JPEG/PNG
                </span>
              </div>

              <form onSubmit={handleImageUpload} className="flex flex-wrap items-center gap-3">
                <input
                  type="file"
                  multiple
                  accept="image/jpeg,image/png"
                  onChange={(e) => setImageFiles(e.target.files)}
                  className="ledger-input text-xs flex-1 min-w-[200px]"
                />
                <button
                  type="submit"
                  disabled={imageUploading || !imageFiles || imageFiles.length === 0}
                  className="btn btn-outline btn-sm"
                >
                  <UploadCloud className="w-3.5 h-3.5" />
                  <span>{imageUploading ? 'Uploading...' : 'Upload Images'}</span>
                </button>
              </form>

              {imageSuccess && (
                <div className="p-2.5 bg-[#2E7D4F]/10 border border-[#2E7D4F]/30 text-[#2E7D4F] text-xs rounded flex items-center gap-2 font-body">
                  <CheckCircle2 className="w-4 h-4 shrink-0" />
                  <span>Product images validated and stored successfully.</span>
                </div>
              )}

              {imageErrors && imageErrors.length > 0 && (
                <div className="p-2.5 bg-[#B3402A]/10 border border-[#B3402A]/30 text-[#B3402A] text-xs rounded space-y-1 font-body">
                  <div className="font-semibold flex items-center gap-1.5">
                    <AlertOctagon className="w-4 h-4 shrink-0" />
                    Image Upload Errors:
                  </div>
                  <ul className="list-disc pl-5 space-y-0.5">
                    {imageErrors.map((err, idx) => (
                      <li key={idx}><strong>{err.filename}:</strong> {err.error}</li>
                    ))}
                  </ul>
                </div>
              )}
            </section>
          )}

          {/* STEP 2: FLIPKART CHANNEL FIELDS */}
          {(activeTab === 'all' || activeTab === 'fields') && (
            <section className="ledger-sheet-subtle p-4 rounded border border-[#1B2A4A]/15 space-y-3">
              <div className="flex items-center justify-between border-b border-[#1B2A4A]/10 pb-2">
                <div className="flex items-center gap-2">
                  <span className="step-number">2</span>
                  <h3 className="font-display font-bold text-sm text-[#1B2A4A]">
                    Fill Flipkart Channel Fields
                  </h3>
                </div>
                <span className="text-xs text-[#1B2A4A]/60 font-body">
                  Marketplace specific attributes
                </span>
              </div>

              <form onSubmit={handleSaveFields} className="space-y-3">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-[#1B2A4A] mb-1 font-body">
                      HSN Code <span className="text-[#B3402A]">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. 61091000"
                      value={hsn}
                      onChange={(e) => setHsn(e.target.value)}
                      className="ledger-input font-mono text-xs"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#1B2A4A] mb-1 font-body">
                      Procurement Type
                    </label>
                    <select
                      value={procurementType}
                      onChange={(e) => setProcurementType(e.target.value)}
                      className="ledger-input text-xs"
                    >
                      <option value="REGULAR">REGULAR</option>
                      <option value="EXPRESS">EXPRESS</option>
                      <option value="INTERNATIONAL">INTERNATIONAL</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#1B2A4A] mb-1 font-body">
                      Shipping Provider
                    </label>
                    <select
                      value={shippingProvider}
                      onChange={(e) => setShippingProvider(e.target.value)}
                      className="ledger-input text-xs"
                    >
                      <option value="FLIPKART">FLIPKART</option>
                      <option value="SELLER">SELLER</option>
                    </select>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-1">
                  {fieldSuccess ? (
                    <span className="text-xs text-[#2E7D4F] font-semibold flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" /> Channel attributes saved
                    </span>
                  ) : <span />}

                  <button
                    type="submit"
                    disabled={savingFields}
                    className="btn btn-outline btn-sm"
                  >
                    <FileCode2 className="w-3.5 h-3.5" />
                    <span>{savingFields ? 'Saving...' : 'Save Channel Fields'}</span>
                  </button>
                </div>
              </form>
            </section>
          )}

          {/* STEP 3 & 4: READINESS & PUBLISH TAB */}
          {(activeTab === 'all' || activeTab === 'readiness') && (
            <>
              {/* STEP 3: CHECK READINESS */}
              <section className="ledger-sheet-subtle p-4 rounded border border-[#1B2A4A]/15 space-y-3">
                <div className="flex items-center justify-between border-b border-[#1B2A4A]/10 pb-2">
                  <div className="flex items-center gap-2">
                    <span className="step-number">3</span>
                    <h3 className="font-display font-bold text-sm text-[#1B2A4A]">
                      Check Pre-Publish Readiness
                    </h3>
                  </div>
                  <button
                    type="button"
                    onClick={checkReadiness}
                    disabled={validating}
                    className="btn btn-outline btn-sm text-xs"
                  >
                    <RefreshCw className={`w-3.5 h-3.5 ${validating ? 'animate-spin' : ''}`} />
                    <span>Refresh Validation</span>
                  </button>
                </div>

                {validationResult && (
                  <div className="space-y-2">
                    {validationResult.valid ? (
                      <div className="p-3 bg-[#2E7D4F]/10 border border-[#2E7D4F]/30 rounded flex items-center justify-between">
                        <div className="flex items-center gap-2.5">
                          <CheckCheck className="w-5 h-5 text-[#2E7D4F]" />
                          <div>
                            <div className="text-xs font-bold text-[#2E7D4F]">
                              All Marketplace Requirements Met
                            </div>
                            <div className="text-xs text-[#1B2A4A]/70">
                              Ready for publishing to Flipkart Listing API v3
                            </div>
                          </div>
                        </div>
                        <StatusStamp status="READY" />
                      </div>
                    ) : (
                      <div className="p-3 bg-[#B3402A]/5 border border-[#B3402A]/25 rounded space-y-2 text-xs">
                        <div className="flex items-center gap-2 text-[#B3402A] font-bold">
                          <AlertTriangle className="w-4 h-4" />
                          <span>Readiness Gaps Detected:</span>
                        </div>

                        {!validationResult.categoryConfigured && (
                          <p className="text-[#B3402A]">
                            • Category <strong>"{product.category}"</strong> is not configured for Flipkart.
                          </p>
                        )}

                        {validationResult.missingFields && validationResult.missingFields.length > 0 && (
                          <div className="text-[#1B2A4A]/90">
                            • Missing required fields: <strong className="font-mono text-[#B3402A]">{validationResult.missingFields.join(', ')}</strong>
                          </div>
                        )}

                        {validationResult.imageIssues && validationResult.imageIssues.length > 0 && (
                          <div className="text-[#1B2A4A]/90">
                            • Image issues:
                            <ul className="list-disc pl-5 mt-0.5 space-y-0.5 text-[#B3402A]">
                              {validationResult.imageIssues.map((issue, i) => (
                                <li key={i}>{issue.reason}</li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                )}
              </section>

              {/* STEP 4: PUBLISH TO FLIPKART & RETRY PUBLISH */}
              <section className="ledger-sheet-subtle p-4 rounded border border-[#1B2A4A]/15 space-y-3">
                <div className="flex items-center justify-between border-b border-[#1B2A4A]/10 pb-2">
                  <div className="flex items-center gap-2">
                    <span className="step-number">4</span>
                    <h3 className="font-display font-bold text-sm text-[#1B2A4A]">
                      {publishStatus === 'REJECTED' ? 'Retry Flipkart Publish' : 'Publish to Flipkart'}
                    </h3>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-[#1B2A4A]/60">Status:</span>
                    <StatusStamp status={publishStatus} />
                  </div>
                </div>

                {/* Stored Error Message Banner - VISIBLE ONLY WHEN REJECTED */}
                {publishStatus === 'REJECTED' && (
                  <div className="p-3.5 bg-[#B3402A]/10 border border-[#B3402A]/30 rounded space-y-2 text-xs text-[#B3402A]">
                    <div className="font-bold flex items-center gap-1.5">
                      <AlertOctagon className="w-4 h-4 shrink-0" />
                      <span>Listing Rejected by Flipkart Marketplace:</span>
                    </div>
                    <div className="font-mono bg-white/90 p-2.5 rounded border border-[#B3402A]/20 text-[#1B2A4A] font-semibold whitespace-pre-wrap">
                      {publishErrorMessage || 'Listing was rejected by the marketplace. Please check channel fields and retry.'}
                    </div>
                    <div className="text-[11px] text-[#1B2A4A]/80">
                      💡 <strong>How to fix:</strong> Resolve the error above (e.g. check HSN code format, dimensions, or images in Steps 1 & 2), ensure Pre-Publish Readiness is <strong>READY</strong>, and click <strong>Retry Publish</strong> below.
                    </div>
                  </div>
                )}

                <div className="flex items-center justify-between pt-1">
                  <div className="text-xs text-[#1B2A4A]/70 max-w-md font-body">
                    {publishStatus === 'REJECTED' ? (
                      isReadyToPublish 
                        ? 'All pre-publish checks now pass! Click "Retry Publish" to re-dispatch to the marketplace.'
                        : 'Readiness gaps detected. Fix issues in Steps 1–3 before retrying.'
                    ) : (
                      isReadyToPublish 
                        ? 'Product is validated. Initiate async publish batch to Flipkart Listing API v3.' 
                        : 'Complete Steps 1–3 above to enable publishing.'
                    )}
                  </div>

                  {/* RETRY PUBLISH BUTTON - Visible only when listing_status.status = 'REJECTED' */}
                  {publishStatus === 'REJECTED' ? (
                    <button
                      type="button"
                      onClick={handleRetryPublish}
                      disabled={!isReadyToPublish || publishing}
                      className="btn btn-marigold flex items-center gap-2"
                      id="retry-publish-btn"
                      title={!isReadyToPublish ? 'Resolve readiness gaps before retrying' : 'Re-run validation and publish'}
                    >
                      <RefreshCw className={`w-4 h-4 ${publishing ? 'animate-spin' : ''}`} />
                      <span>{publishing ? 'Retrying & Polling...' : 'Retry Publish'}</span>
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={handlePublish}
                      disabled={!isReadyToPublish || publishing}
                      className="btn btn-marigold flex items-center gap-2"
                      id="publish-btn"
                    >
                      <Send className="w-4 h-4" />
                      <span>{publishing ? 'Publishing & Polling...' : 'Publish to Flipkart'}</span>
                    </button>
                  )}
                </div>

                {/* Live Polling Status Box */}
                {publishBatchInfo && (
                  <div className="p-3 bg-white border border-[#1B2A4A]/20 rounded space-y-2 mt-3 text-xs">
                    <div className="flex items-center justify-between border-b border-[#1B2A4A]/10 pb-1.5">
                      <div className="font-mono text-[#1B2A4A]/70">
                        Batch ID: <span className="font-bold text-[#1B2A4A]">{publishBatchInfo.batchId}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-[#1B2A4A]/60">Batch Status:</span>
                        <StatusStamp status={publishBatchInfo.status} />
                      </div>
                    </div>

                    {publishing && (
                      <div className="flex items-center gap-2 text-[#C98A2B] font-medium animate-pulse">
                        <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                        <span>Polling Flipkart batch status every 2 seconds...</span>
                      </div>
                    )}

                    {publishErrorMessage && (
                      <div className="text-[#B3402A] font-semibold flex items-start gap-1.5 pt-1">
                        <AlertOctagon className="w-4 h-4 shrink-0 mt-0.5" />
                        <span>API response: {publishErrorMessage}</span>
                      </div>
                    )}
                  </div>
                )}
              </section>
            </>
          )}

          {/* MULTI-CHANNEL SYNC PANEL */}
          {(activeTab === 'all' || activeTab === 'sync') && (
            <section className="ledger-sheet-subtle p-4 rounded border border-[#1B2A4A]/15 space-y-3">
              <div className="flex items-center justify-between border-b border-[#1B2A4A]/10 pb-2">
                <div className="flex items-center gap-2">
                  <Zap className="w-4 h-4 text-[#C98A2B]" />
                  <h3 className="font-display font-bold text-sm text-[#1B2A4A]">
                    Multi-Channel Inventory Propagation & Sync Status
                  </h3>
                </div>
                <button
                  type="button"
                  onClick={fetchChannelStatus}
                  disabled={loadingSync}
                  className="btn btn-outline btn-sm text-xs"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${loadingSync ? 'animate-spin' : ''}`} />
                  <span>Refresh Sync</span>
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                {/* Flipkart Card */}
                <div className="p-3 bg-white border border-[#1B2A4A]/20 rounded space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-[#1B2A4A]">Flipkart Marketplace</span>
                    <StatusStamp status={publishStatus} />
                  </div>
                  <div className="text-[#1B2A4A]/70">
                    Channel Service: <span className="font-mono text-[#1B2A4A]">Port 8081</span>
                  </div>
                  <div className="text-[#1B2A4A]/70">
                    Last Synced: <span className="font-mono text-[#1B2A4A]">
                      {channelSyncInfo?.channels?.find(c => c.channel === 'FLIPKART')?.lastSyncedAt || 'Not synced'}
                    </span>
                  </div>
                </div>

                {/* Amazon Card */}
                <div className="p-3 bg-white border border-[#1B2A4A]/20 rounded space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-[#1B2A4A]">Amazon Marketplace</span>
                    <StatusStamp status={channelSyncInfo?.channels?.find(c => c.channel === 'AMAZON')?.status || 'DRAFT'} />
                  </div>
                  <div className="text-[#1B2A4A]/70">
                    Amazon Mock Stock: <span className="font-mono font-bold text-[#2E7D4F]">
                      {channelSyncInfo?.channels?.find(c => c.channel === 'AMAZON')?.mockStock ?? 'N/A'}
                    </span>
                  </div>
                  <div className="text-[#1B2A4A]/70">
                    Last Synced: <span className="font-mono text-[#1B2A4A]">
                      {channelSyncInfo?.channels?.find(c => c.channel === 'AMAZON')?.lastSyncedAt || 'Not synced'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Order Simulation Action */}
              <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-[#1B2A4A]/10">
                <div className="text-xs text-[#1B2A4A]/70">
                  Simulate an inbound order from Flipkart to verify that stock decrements on the main platform and automatically propagates to Amazon.
                </div>
                <button
                  type="button"
                  onClick={handleSimulateOrder}
                  disabled={simulatingOrder}
                  className="btn btn-outline btn-sm shrink-0 flex items-center gap-1.5"
                >
                  <Zap className={`w-3.5 h-3.5 text-[#C98A2B] ${simulatingOrder ? 'animate-bounce' : ''}`} />
                  <span>{simulatingOrder ? 'Simulating...' : '⚡ Simulate Flipkart Order (1 Unit)'}</span>
                </button>
              </div>

              {orderSimulationMsg && (
                <div className="p-2 bg-[#1B2A4A]/5 border border-[#1B2A4A]/20 rounded text-xs text-[#1B2A4A] font-medium">
                  {orderSimulationMsg}
                </div>
              )}
            </section>
          )}
        </div>
      </div>
    </div>
  );
};
