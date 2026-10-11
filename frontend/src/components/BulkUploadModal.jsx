import React, { useState } from 'react';
import { api } from '../services/api';
import { X, UploadCloud, FileText, CheckCircle2, AlertOctagon, Download } from 'lucide-react';

export const BulkUploadModal = ({ onClose, onSuccess }) => {
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [result, setResult] = useState(null);
  const [generalError, setGeneralError] = useState(null);

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
      setResult(null);
      setGeneralError(null);
    }
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file) return;

    setUploading(true);
    setResult(null);
    setGeneralError(null);

    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await api.bulkUpload(formData);
      setResult(res);
      if (onSuccess) onSuccess();
    } catch (err) {
      setGeneralError(err.message || 'CSV bulk upload failed');
    } finally {
      setUploading(false);
    }
  };

  const handleDownloadSampleCsv = () => {
    const csvContent = `sku,title,description,category,brand,mrp,sellingPrice,stock,lengthCm,breadthCm,heightCm,weightKg
TSHIRT-SL-001,Cotton Slim Fit T-Shirt,100% Organic Ring-Spun Cotton,Apparel > T-Shirts,Aura,999.00,599.00,50,25.0,20.0,2.5,0.250
TSHIRT-SL-002,Oversized Vintage Tee,Heavyweight Vintage Wash Graphic Tee,Apparel > T-Shirts,Aura,1299.00,799.00,30,28.0,22.0,3.0,0.300
TSHIRT-SL-003,Classic Crewneck Sweatshirt,French Terry Fleece Warm Winter Sweatshirt,Apparel > T-Shirts,Aura,1999.00,1199.00,20,30.0,25.0,4.0,0.450
`;
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'sample_products_manifest.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-fade-in">
      <div className="bg-white border border-[#E5E7EB] w-full max-w-3xl p-6 sm:p-8 rounded-[2px] shadow-[0_20px_50px_rgba(0,0,0,0.12)] relative max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-start justify-between border-b border-[#E5E7EB] pb-4 mb-5">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-mono font-semibold bg-[#111111] text-white px-2 py-0.5 rounded-[2px]">
                CSV
              </span>
              <h2 className="text-xl font-medium text-[#111111] tracking-tight">
                Bulk Catalog Ingestion
              </h2>
            </div>
            <p className="text-xs text-[#555555] mt-1 font-normal">
              Upload product records in standard CSV canonical manifest format.
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-[#777777] hover:text-[#111111] transition-colors rounded-[2px] cursor-pointer"
            aria-label="Close dialog"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Area */}
        <div className="overflow-y-auto flex-1 space-y-5 pr-1">
          {/* Upload Form */}
          <form onSubmit={handleUpload} className="space-y-4">
            <div className="p-6 border border-dashed border-[#D1D5DB] hover:border-[#111111] rounded-[2px] bg-[#FAFAFA] transition-colors flex flex-col items-center justify-center text-center">
              <FileText className="w-8 h-8 text-[#777777] mb-2" />
              <input
                type="file"
                id="csv-file-input"
                accept=".csv"
                onChange={handleFileChange}
                className="hidden"
              />
              <label
                htmlFor="csv-file-input"
                className="cursor-pointer font-medium text-xs text-[#111111] underline hover:text-[#333333]"
              >
                {file ? file.name : 'Select CSV manifest file from computer'}
              </label>
              <p className="text-[11px] text-[#777777] mt-1 font-mono">
                Supported columns: sku, title, description, category, brand, mrp, sellingPrice, stock
              </p>
            </div>

            <div className="flex items-center justify-between">
              <button
                type="button"
                onClick={handleDownloadSampleCsv}
                className="btn-rect text-xs py-2 px-3"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Download Sample CSV</span>
              </button>

              <button
                type="submit"
                disabled={uploading || !file}
                className="btn-rect-primary text-xs py-2 px-4 disabled:opacity-40"
              >
                <UploadCloud className="w-3.5 h-3.5" />
                <span>{uploading ? 'Ingesting rows...' : 'Ingest CSV Manifest'}</span>
              </button>
            </div>
          </form>

          {/* General Error Alert */}
          {generalError && (
            <div className="p-3 border border-red-200 bg-red-50 text-red-700 text-xs rounded-[2px] flex items-start gap-2 font-normal">
              <AlertOctagon className="w-4 h-4 shrink-0 mt-0.5" />
              <div>
                <div className="font-semibold">Ingestion Failed:</div>
                <div>{generalError}</div>
              </div>
            </div>
          )}

          {/* Results Summary & Failed Rows Breakdown */}
          {result && (
            <div className="space-y-4 pt-3 border-t border-[#E5E7EB]">
              {/* Summary Stats */}
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 border border-emerald-200 bg-emerald-50/50 rounded-[2px] flex items-center gap-3">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                  <div>
                    <div className="text-[11px] font-mono uppercase tracking-wider text-emerald-700 font-semibold">
                      Successfully Ingested
                    </div>
                    <div className="text-xl font-bold font-mono text-emerald-700">
                      {result.successCount} rows
                    </div>
                  </div>
                </div>

                <div className={`p-4 border rounded-[2px] flex items-center gap-3 ${
                  result.failedRows && result.failedRows.length > 0
                    ? 'border-red-200 bg-red-50/50'
                    : 'border-[#E5E7EB] bg-[#FAFAFA]'
                }`}>
                  <AlertOctagon className={`w-5 h-5 ${
                    result.failedRows && result.failedRows.length > 0 ? 'text-red-600' : 'text-[#888888]'
                  }`} />
                  <div>
                    <div className="text-[11px] font-mono uppercase tracking-wider text-[#555555] font-semibold">
                      Rejected Rows
                    </div>
                    <div className={`text-xl font-bold font-mono ${
                      result.failedRows && result.failedRows.length > 0 ? 'text-red-600' : 'text-[#777777]'
                    }`}>
                      {result.failedRows ? result.failedRows.length : 0} rows
                    </div>
                  </div>
                </div>
              </div>

              {/* Failed Rows Detail Table */}
              {result.failedRows && result.failedRows.length > 0 && (
                <div className="space-y-2">
                  <div className="text-xs font-semibold text-red-700 uppercase tracking-wider font-mono">
                    Row-Level Ingestion Errors:
                  </div>
                  <div className="border border-[#E5E7EB] rounded-[2px] overflow-hidden">
                    <table className="w-full text-left border-collapse text-xs">
                      <thead>
                        <tr className="bg-[#FAFAFA] border-b border-[#E5E7EB] text-[#555555] font-mono text-[11px]">
                          <th className="py-2.5 px-3 w-16 text-center">Row</th>
                          <th className="py-2.5 px-3 w-32">SKU Code</th>
                          <th className="py-2.5 px-3">Failure Reason / Corrective Action</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-[#E5E7EB]">
                        {result.failedRows.map((err, idx) => (
                          <tr key={idx} className="hover:bg-[#F8FAFC]">
                            <td className="py-2 px-3 font-mono text-center font-medium text-[#111111]">
                              #{err.row}
                            </td>
                            <td className="py-2 px-3 font-mono font-medium text-[#111111]">
                              {err.sku || '—'}
                            </td>
                            <td className="py-2 px-3 text-red-700 font-medium">
                              {err.error}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* Actions */}
              <div className="pt-2 flex flex-col sm:flex-row gap-3">
                {result.failedRows && result.failedRows.some((r) => r.error && r.error.toLowerCase().includes('already exists')) && (
                  <button
                    type="button"
                    onClick={async () => {
                      if (!window.confirm('Delete all existing products in your catalog and upload this CSV file now?')) {
                        return;
                      }
                      setUploading(true);
                      try {
                        await api.deleteAllProducts();
                        const formData = new FormData();
                        formData.append('file', file);
                        const res = await api.bulkUpload(formData);
                        setResult(res);
                        if (onSuccess) onSuccess();
                      } catch (err) {
                        alert(err.message || 'Failed to clear and re-upload');
                      } finally {
                        setUploading(false);
                      }
                    }}
                    className="btn-rect text-xs text-red-700 border-red-200 hover:border-red-600 hover:bg-red-50 flex-1 py-2.5"
                  >
                    <span>Clear Existing Catalog &amp; Ingest</span>
                  </button>
                )}

                <button
                  type="button"
                  onClick={() => {
                    if (onSuccess) onSuccess();
                    onClose();
                  }}
                  className="btn-rect-primary flex-1 py-2.5 text-xs"
                >
                  <span>View Catalog in Ledger ({result.successCount} added)</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
