package com.listingplatform.channel;

public interface ChannelStockAdapter {

    /**
     * The standardized name of the marketplace channel (e.g. "FLIPKART", "AMAZON").
     */
    String getChannelName();

    /**
     * Propagate updated available stock to the external channel.
     *
     * @param sku      The canonical product SKU
     * @param newStock The newly decremented available inventory level
     */
    void updateStock(String sku, int newStock);
}
