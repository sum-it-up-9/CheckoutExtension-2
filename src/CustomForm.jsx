import React, {  useEffect } from "react";


let cartId;
let PriceListType;
let extensionService;


const ExtensionCommandType = {
  ReloadCheckout: "EXTENSION:RELOAD_CHECKOUT",
  ShowLoadingIndicator: "EXTENSION:SHOW_LOADING_INDICATOR",
  SetIframeStyle: "EXTENSION:SET_IFRAME_STYLE",
};


function sleep(ms) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

function showLoadingIndicator() {
  extensionService.post({
    type: ExtensionCommandType.ShowLoadingIndicator,
    payload: { show: true },
  });
}

function hideLoadingIndicator() {
  extensionService.post({
    type: ExtensionCommandType.ShowLoadingIndicator,
    payload: { show: false },
  });
}

async function sendMessage() {
  window.top.postMessage(
    "hide-checkout-shipping-continue",
    "https://sellars-absorbent-materials-sandbox-1.mybigcommerce.com/"
  );
  window.top.postMessage(
    "set-keepButtonBEnabled-false",
    "https://sellars-absorbent-materials-sandbox-1.mybigcommerce.com/"
  );
}

const CustomForm = () => { 
    const updatePriceListAndCart = async (bodyData) => {
      const apiUrl = 'http://localhost:3000/assign-price-list'; 
      try {
        const response = await fetch(apiUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(bodyData), 
        });

        if (!response.ok) {
          
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.json();       
        PriceListType = JSON.parse(data?.customerAttributeValue);
      } catch (error) {
        console.log(error.message); 
      } 
    };

    const getCustomerPriceListType = async (cartId) => {
      const apiUrl = 'http://localhost:3000/getCustomerPriceListType'; 
      try {
        const response = await fetch(apiUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ cartId }), 
        });

        if (!response.ok) {
          
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.json();       
        PriceListType = JSON.parse(data?.customerAttributeValue);
      } catch (error) {
        console.log(error.message); 
      } 
    };
  

  useEffect(() => {
    checkoutKitLoader.load("extension").then(async function (module) {
      const params = new URL(document.location).searchParams;
      const extensionId = params.get("extensionId");
      const parentOrigin = params.get("parentOrigin");
    
      cartId = params.get("cartId");
      let raw2 = JSON.stringify({
        cartId: cartId,
      });

      await getCustomerPriceListType(cartId);     

     
      try {
        extensionService = await module.initializeExtensionService({
          extensionId,
          parentOrigin,
          taggedElementId: "container",
        });
      } catch (error) {
        console.error("Extension service failed to load by Bigcommerce", error);
      }
   
      if(extensionService){
        extensionService.addListener(
          "EXTENSION:CONSIGNMENTS_CHANGED",
          async (data) => {
            //console.log("inside consignments chnaged listener");
            console.log('event changed called from CE',data);
            

            showLoadingIndicator();
            // console.log('curr consignments: ',data?.payload?.consignments);
            // console.log('prev consignment:',data?.payload?.previousConsignments);
            //post message to parent window - hide continue button
            sendMessage();
  
            let selectedShippingOption = data?.payload?.consignments?.[0]?.selectedShippingOption?.description
            await updatePriceListAndCart({...PriceListType,selectedShippingOption});
            
          
            extensionService.post({
              type: ExtensionCommandType.ReloadCheckout,
            });
            //await sleep(1000);
            hideLoadingIndicator();
            sendMessage();
          }
        );
      }     
    });   
  }, []);

  return (
    
    <div id="container"></div>
  
  );
};

export default CustomForm;
