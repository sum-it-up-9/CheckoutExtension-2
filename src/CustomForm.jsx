import React, { useState, useEffect } from "react";
import "./CustomForm.css";
import { toast } from "react-toastify";
import Radio from "@mui/material/Radio";
import FormControlLabel from "@mui/material/FormControlLabel";
import Select from "@mui/material/Select";
import TextField from "@mui/material/TextField";
import Grid from "@mui/material/Grid";
import { FormControl, InputLabel, MenuItem } from "@mui/material";

const CustomerPreferred = {
  CarrierName: {
    label: "Carrier Name",
    type: "text",
    formName: "CustomerPreferredObj",

    required: true,
  },

  Address2: {
    label: "Address 2",
    type: "text",
    formName: "CustomerPreferredObj",

    required: false,
  },
  State: {
    label: "State",
    type: "dropdown",
    formName: "CustomerPreferredObj",
    required: true,

    fieldOptions: [
      "Alabama",
      "Alaska",
      "Arizona",
      "Arkansas",
      "California",
      "Colorado",
      "Connecticut",
      "Delaware",
      "Florida",
      "Georgia",
      "Hawaii",
      "Idaho",
      "Illinois",
      "Indiana",
      "Iowa",
      "Kansas",
      "Kentucky",
      "Louisiana",
      "Maine",
      "Maryland",
      "Massachusetts",
      "Michigan",
      "Minnesota",
      "Mississippi",
      "Missouri",
      "Montana",
      "Nebraska",
      "Nevada",
      "New Hampshire",
      "New Jersey",
      "New Mexico",
      "New York",
      "North Carolina",
      "North Dakota",
      "Ohio",
      "Oklahoma",
      "Oregon",
      "Pennsylvania",
      "Rhode Island",
      "South Carolina",
      "South Dakota",
      "Tennessee",
      "Texas",
      "Utah",
      "Vermont",
      "Virginia",
      "Washington",
      "West Virginia",
      "Wisconsin",
      "Wyoming",
    ],
  },
  Country: {
    label: "Country",
    type: "dropdown",
    formName: "CustomerPreferredObj",
    required: true,

    fieldOptions: ["United States"],
  },
};

const WillCall = {
  ContactEmail: {
    lable: "Contact Email",
    type: "email",
    formName: "WillCallObj",

    required: true,
  },
};

const UPS = {
  Ground: {
    label: "Ground",
    type: "radio",
    formName: "UPSObj",
  },
  "2nd Day Air": {
    label: "2nd Day Air",
    type: "radio",
    formName: "UPSObj",
  },
  "2nd Day Air AM": {
    label: "2nd Day Air AM",
    type: "radio",
    formName: "UPSObj",
  },
  "3 Day Select": {
    label: "3 Day Select",
    type: "radio",
    formName: "UPSObj",
  },
  "Next Day Air": {
    label: "Next Day Air",
    type: "radio",
    formName: "UPSObj",
  },
  "Next Day Air AM": {
    label: "Next Day Air AM",
    type: "radio",
    formName: "UPSObj",
  },
  "Next Day Air Saver": {
    label: "Next Day Air Saver",
    type: "radio",
    formName: "UPSObj",
  },
};

const FedEx = {
  Ground: {
    label: "Ground",
    type: "radio",
    formName: "FedExObj",
  },
  "2Day": {
    label: "2 Day",
    type: "radio",
    formName: "FedExObj",
  },
  PriorityOvernight: {
    label: "Priority Overnight",
    type: "radio",
    formName: "FedExObj",
  },
  StandardOvernight: {
    label: "Standard Overnight",
    type: "radio",
    formName: "FedExObj",
  },
};

let cartId;
let cartTotal;
let extensionService;
let payload = {};
let metafields;
let prevMetafieldsPayload;
let shouldRender = true;
let whoPaysShippingGlobal = "Customer Pays Freight";
let selectedShipperGlobal = "FedEx";
let sellarsShipperGlobal = "Prepaid LTL";
let customerFetchResult;

let customerPreferredObjGlobal = {
  CarrierName: "",
  Address2: "",
  State: "",
  Country: "",
};

let WillCallObjGlobal = {
  ContactEmail: "",
};
let FedExObjGlobal = "Ground";
let UPSObjGlobal = "Ground";
let accountNumberGlobal = "";
let aa;

const ExtensionCommandType = {
  ReloadCheckout: "EXTENSION:RELOAD_CHECKOUT",
  ShowLoadingIndicator: "EXTENSION:SHOW_LOADING_INDICATOR",
  SetIframeStyle: "EXTENSION:SET_IFRAME_STYLE",
};

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
  const [formData, setFormData] = useState({});
  const [flagForRender, setflagForRender] = useState(true); // Default to true

  const [flag, setFlag] = useState(false);

  const [specialInstructions, setSpecialInstructions] = useState("");
  const [accountNumber, setAccountNumber] = useState("");
  //console.log('trying to assign to usestate: ', metafields?.whoPaysShippping);
  const initialwhoPaysShippping = metafields?.whoPaysShippping;
  // console.log('initialwhoPaysShippping: ', initialwhoPaysShippping);
  const [whoPaysShippping, setWhoPaysShipping] = useState(
    "Customer Pays Freight"
  );

  useEffect(() => {
    const params = new URL(document.location).searchParams;
    const cartId = params.get("cartId");
    console.log("check if cartId available", cartId);
    console.log("params", params);
    if (initialwhoPaysShippping) {
      if (
        cartTotal < 1000 &&
        initialwhoPaysShippping === "Sellars Pays Freight"
      ) {
        aa = 4;
        //do nothing
      } else {
        setWhoPaysShipping(initialwhoPaysShippping);
        whoPaysShippingGlobal = initialwhoPaysShippping;
      }
    }
  }, [initialwhoPaysShippping]);

  // const initialuseFedExAccount = metafields?.useFedExAccount;
  const initialAccountNumber = metafields?.AccountNumber;

  // useEffect(() => {
  //   if (initialuseFedExAccount === "Yes") {
  //     setIsUsingFedExAccount("Yes");
  //   }
  // }, [initialuseFedExAccount]);

  useEffect(() => {
    if (initialAccountNumber) {
      setAccountNumber(initialAccountNumber);
      accountNumberGlobal = initialAccountNumber;
    }
  }, [initialAccountNumber]);

  const [isDisplayingAccountNumber, setIsDisplayingAccountNumber] =
    useState("FedEx");

  const [FormFields, setFormFields] = useState(FedEx);

  const initialShipper = metafields?.shipper;
  const [selectedShipper, setSelectedShipper] = useState("FedEx");
  const [sellarsShipper, setSellarsShipper] = useState("Prepaid LTL");

  function formDataUpdate(initialwhoPaysShippping, initialShipper) {
    if (initialwhoPaysShippping === "Sellars Pays Freight") {
    } else {
      const formData = metafields?.formData;

      if (formData) {
        if (initialShipper === "FedEx") {
          setFedExObj(formData);
          FedExObjGlobal = formData;
        } else if (initialShipper === "UPS") {
          setUPSObj(formData);
          UPSObjGlobal = formData;
        } else if (initialShipper === "Customer Preferred Carrier") {
          setCustomerPreferredObj((prevState) => {
            let newObj = {};
            for (let key in formData) {
              if (key in prevState) {
                newObj[key] = formData[key];
              }
            }
            customerPreferredObjGlobal = newObj;
            return newObj;
          });
        } else if (initialShipper === "Will Call") {
          setWillCallObj((prevState) => {
            let newObj = {};
            for (let key in formData) {
              if (key in prevState) {
                newObj[key] = formData[key];
              }
            }
            WillCallObjGlobal = newObj;
            return newObj;
          });
        }
      }
    }
  }

  useEffect(() => {
    if (!initialShipper) return;

    if (initialwhoPaysShippping === "Sellars Pays Freight") {
      setSellarsShipper(initialShipper);
      sellarsShipperGlobal = initialShipper;
    } else {
      setSelectedShipper(initialShipper);
      selectedShipperGlobal = initialShipper;
      formDataUpdate(initialwhoPaysShippping, initialShipper);
      if (initialShipper === "UPS") {
        setFormFields(UPS);
        setIsDisplayingAccountNumber("UPS");
      } else if (initialShipper === "Will Call") {
        setFormFields(WillCall);
        setIsDisplayingAccountNumber("WillCall");
      } else if (initialShipper === "FedEx") {
        setFormFields(FedEx);
        setIsDisplayingAccountNumber("FedEx");
      } else if (initialShipper === "Customer Preferred Carrier") {
        setFormFields(CustomerPreferred);
        setIsDisplayingAccountNumber("Customer Preferred Carrier");
      } else if (initialShipper === "Prepay and Add") {
        setFormFields({});
        setIsDisplayingAccountNumber("Prepay and Add");
      }
    }
  }, [initialShipper]);

  const [checkoutid, setCheckoutid] = useState(0);

  const [customerPreferredObj, setCustomerPreferredObj] = useState({
    CarrierName: "",
    Address2: "",
    State: "",
    Country: "",
  });

  const [WillCallObj, setWillCallObj] = useState({
    ContactEmail: "",
  });

  const [FedExObj, setFedExObj] = useState("Ground");
  const [UPSObj, setUPSObj] = useState("Ground");

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

  async function consignmentUpdateTriggered(extensionService, cartId, data) {
    //console.log("consignments changed", data);
    try {
      await UpdateCartPrice(
        cartId,
        whoPaysShippingGlobal,
        selectedShipperGlobal
      );
    } catch (e) {
      toast.error("update cart Price failed, Try again");
      //console.log("Error in requestCartPriceUpdate");
    }
    //sleep for 1 second
    await sleep(1000);
  }

  function compareConsignments(consignments, previousConsignments) {
    let changed = false;
    consignments.forEach((consignment) => {
      const {
        id,
        shippingAddress: { country, stateOrProvinceCode },
      } = consignment;

      if (previousConsignments.length === 0) {
        changed = true;
      } else {
        const prevConsignment = previousConsignments.find(
          (prev) => prev.id === id
        );
        const previousCountry = prevConsignment?.shippingAddress?.country;
        const previousStateOrProvinceCode =
          prevConsignment?.shippingAddress?.stateOrProvinceCode;

        if (country !== previousCountry) {
          //console.log(    `️🔄 Consignment #${id} shipping country change: ${previousCountry} -> ${country}.` );
          changed = true;
        }
        if (stateOrProvinceCode !== previousStateOrProvinceCode) {
          // console.log( `️🔄 Consignment #${id} shipping state change: ${previousStateOrProvinceCode} -> ${stateOrProvinceCode}.` );
          changed = true;
        }
        //dont use this as we are not using shipping methods from control panel
        // if (shippingOptionId !== previousShippingOptionId) {
        //   console.log(`️🔄 Consignment #${id} shipping option change: ${previousShippingOptionId} -> ${shippingOptionId}.`);
        //   changed = true;
        // }
      }
    });
    return changed;
  }

  const handleShippingChange = async (event) => {
    setWhoPaysShipping(event.target.value);
    whoPaysShippingGlobal = event.target.value;

    extensionService.post({
      type: ExtensionCommandType.ShowLoadingIndicator,
      payload: { show: true },
    });
    //post message to parent window - hide continue button
    sendMessage();

    //call azure function to update the product prices
    try {
      await UpdateCartPrice(cartId, event.target.value);
      // console.log(" reload checkout with updated price.");
      extensionService.post({
        type: ExtensionCommandType.ReloadCheckout,
      });
    } catch (e) {
      toast.error("Error in updating the cart price, Try again!");
      // console.log("Error in UpdateCartPrice", e);
    }

    await sleep(1000);
    hideLoadingIndicator();
    sendMessage();
  };

  const handleSellersShipperChange = (e) => {
    sendMessage();
    setSellarsShipper(e.target.value);
    selectedShipperGlobal = e.target.value;
  };

  function handleWillCallChange(e) {
    setWillCallObj((prev) => {
      let newObj = { ...prev, [e.target.name]: e.target.value };

      WillCallObjGlobal = newObj;
      return newObj;
    });
  }

  function handleFedExChange(e) {
    setFedExObj(e.target.value);
    FedExObjGlobal = e.target.value;
  }

  function handleUPSChange(e) {
    setUPSObj(e.target.value);
    UPSObjGlobal = e.target.value;
  }

  function handleCustomerPreferredChange(e) {
    // setCustomerPreferredObj((prev) => {
    //   return { ...prev, [e.target.name]: e.target.value };
    // });
    setCustomerPreferredObj((prev) => {
      let newObj = { ...prev, [e.target.name]: e.target.value };

      customerPreferredObjGlobal = newObj;
      return newObj;
    });
  }

  const handleShipperChange = (event) => {
    const Shipper = event.target.value;

    setSelectedShipper(Shipper);
    selectedShipperGlobal = Shipper;
    sendMessage();
    if (Shipper === "UPS") {
      setFormFields(UPS);
      setIsDisplayingAccountNumber("UPS");
    } else if (Shipper === "Will Call") {
      setFormFields(WillCall);
      setIsDisplayingAccountNumber("WillCall");
    } else if (Shipper === "FedEx") {
      setFormFields(FedEx);
      setIsDisplayingAccountNumber("FedEx");
    } else if (Shipper === "Customer Preferred Carrier") {
      setFormFields(CustomerPreferred);
      setIsDisplayingAccountNumber("Customer Preferred Carrier");
    } else if (Shipper === "Prepay and Add") {
      setFormFields({});
      setIsDisplayingAccountNumber("Prepay and Add");
    }
  };

  const renderFormField = (fieldName, fieldType, formName, fieldOptions) => {
    if (fieldType.type === "text") {
      return (
        <>
          <TextField
            fullWidth
            label={fieldName}
            variant="outlined"
            name={fieldName}
            required={fieldType.required}
            value={
              formName === "WillCallObj"
                ? WillCallObj[fieldName]
                : customerPreferredObj[fieldName]
            }
            onChange={(e) => {
              sendMessage();
              if (formName === "FedExObj") {
                handleFedExChange(e);
              } else if (formName === "WillCallObj") {
                handleWillCallChange(e);
              } else if (formName === "UPSObj") {
                handleUPSChange(e);
              } else if (formName === "CustomerPreferredObj") {
                handleCustomerPreferredChange(e);
              }
            }}
          />
        </>
      );
    } else if (fieldType.type === "dropdown") {
      return (
        <FormControl fullWidth>
          <InputLabel>Select a {fieldName}</InputLabel>
          <Select
            style={{ marginBottom: "20px" }}
            name={fieldName}
            value={
              formName === "WillCallObj"
                ? WillCallObj[fieldName]
                : customerPreferredObj[fieldName]
            }
            label={`Select a ${fieldName}`}
            required={fieldType.required}
            onChange={(e) => {
              sendMessage();
              if (formName === "FedExObj") {
                handleFedExChange(e);
              } else if (formName === "WillCallObj") {
                handleWillCallChange(e);
              } else if (formName === "UPSObj") {
                handleUPSChange(e);
              } else if (formName === "CustomerPreferredObj") {
                handleCustomerPreferredChange(e);
              }
            }}
          >
            {fieldOptions.map((option) => (
              <MenuItem key={option} value={option}>
                {option}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      );
    } else if (fieldType.type === "radio") {
      return (
        <div>
          <FormControlLabel
            name={fieldName}
            value={fieldType.label}
            control={<Radio />}
            label={fieldType.label}
            checked={
              formName === "FedExObj"
                ? FedExObj === fieldType.label
                : UPSObj === fieldType.label
            }
            onChange={(e) => {
              sendMessage();
              if (formName === "FedExObj") {
                handleFedExChange(e);
              } else if (formName === "UPSObj") {
                handleUPSChange(e);
              }
            }}
          />
        </div>
      );
    } else if (fieldType.type === "email") {
      return (
        <>
          <TextField
            fullWidth
            variant="outlined"
            id={fieldName}
            type="email"
            required={fieldType.required}
            label={fieldName}
            name={fieldName}
            value={
              formName === "WillCallObj"
                ? WillCallObj[fieldName]
                : customerPreferredObj[fieldName]
            }
            onChange={(e) => {
              sendMessage();
              if (formName === "FedExObj") {
                handleFedExChange(e);
              } else if (formName === "WillCallObj") {
                handleWillCallChange(e);
              } else if (formName === "UPSObj") {
                handleUPSChange(e);
              } else if (formName === "CustomerPreferredObj") {
                handleCustomerPreferredChange(e);
              }
            }}
          />
        </>
      );
    }
  };

  // const handleFedExAccountChange = (e) => {
  //   sendMessage();
  //   setIsUsingFedExAccount(e.target.value);
  // };

  async function UpdateCartPrice(
    cartId,
    whoPaysFreightLocal,
    selectedShipperGlobal
  ) {
    let raw;

    //here fucntions second atturibute's name is similar to usestate varible so kindly do not get confused with 2nd parameter of function with state variable as both are different
    if (whoPaysFreightLocal) {
      if (whoPaysFreightLocal === "Customer Pays Freight") {
        if (selectedShipperGlobal) {
          if (selectedShipperGlobal === "FedEx") {
            payload = {
              whoPaysShippping: "Customer Pays Freight",
              shipper: selectedShipperGlobal,
              specialInstructions,
              formData: FedExObjGlobal,
              AccountNumber: accountNumberGlobal,
            };
          } else if (selectedShipperGlobal === "Customer Preferred Carrier") {
            payload = {
              whoPaysShippping: "Customer Pays Freight",
              shipper: selectedShipperGlobal,
              AccountNumber: accountNumberGlobal,
              formData: customerPreferredObjGlobal,
              specialInstructions,
            };
          } else if (selectedShipperGlobal === "UPS") {
            payload = {
              whoPaysShippping: "Customer Pays Freight",
              shipper: selectedShipperGlobal,
              AccountNumber: accountNumberGlobal,
              formData: UPSObjGlobal,
              specialInstructions,
            };
          } else if (selectedShipperGlobal === "Will Call") {
            payload = {
              whoPaysShippping: "Customer Pays Freight",
              shipper: selectedShipperGlobal,
              formData: WillCallObjGlobal,
              specialInstructions,
            };
          } else if (selectedShipperGlobal === "Prepay and Add") {
            payload = {
              whoPaysShippping: "Customer Pays Freight",
              shipper: selectedShipperGlobal,
              formData: {},
              specialInstructions,
            };
          } else {
            payload = {
              whoPaysShippping: "Customer Pays Freight",
              shipper: FedEx,
              formData: FedExObjGlobal,
              specialInstructions,
            };
          }
        } else {
          if (selectedShipper === "FedEx") {
            payload = {
              whoPaysShippping: "Customer Pays Freight",
              shipper: selectedShipper,
              specialInstructions,
              formData: FedExObj,
              AccountNumber: accountNumber,
            };
          } else if (selectedShipper === "Customer Preferred Carrier") {
            payload = {
              whoPaysShippping: "Customer Pays Freight",
              shipper: selectedShipper,
              AccountNumber: accountNumber,
              formData: customerPreferredObj,
              specialInstructions,
            };
          } else if (selectedShipper === "UPS") {
            payload = {
              whoPaysShippping: "Customer Pays Freight",
              shipper: selectedShipper,
              AccountNumber: accountNumber,
              formData: UPSObj,
              specialInstructions,
            };
          } else if (selectedShipper === "Will Call") {
            payload = {
              whoPaysShippping: "Customer Pays Freight",
              shipper: selectedShipper,
              formData: WillCallObj,
              specialInstructions,
            };
          } else if (selectedShipper === "Prepay and Add") {
            payload = {
              whoPaysShippping: "Customer Pays Freight",
              shipper: selectedShipper,
              formData: {},
              specialInstructions,
            };
          } else {
            payload = {
              whoPaysShippping: "Customer Pays Freight",
              shipper: FedEx,
              formData: FedExObj,
              specialInstructions,
            };
          }
        }
      } else {
        payload = {};
        payload.shipper = "Prepaid LTL";
        payload.specialInstructions = specialInstructions;
        payload.whoPaysShippping = "Sellars Pays Freight";
      }
      raw = JSON.stringify({
        checkoutId: cartId,
        whoPaysShipping:
          whoPaysFreightLocal === "Customer Pays Freight"
            ? "Customer Pays Freight"
            : "Sellars Pays Freight",
        metafields: payload,
      });
    } else {
      if (whoPaysShippping === "Customer Pays Freight") {
        if (selectedShipper === "FedEx") {
          payload = {
            whoPaysShippping: "Customer Pays Freight",
            shipper: selectedShipper,
            specialInstructions,
            formData: FedExObj,
            AccountNumber: accountNumber,
          };
        } else if (selectedShipper === "Customer Preferred Carrier") {
          payload = {
            whoPaysShippping: "Customer Pays Freight",
            shipper: selectedShipper,
            AccountNumber: accountNumber,
            formData: customerPreferredObj,
            specialInstructions,
          };
        } else if (selectedShipper === "UPS") {
          payload = {
            whoPaysShippping: "Customer Pays Freight",
            shipper: selectedShipper,
            AccountNumber: accountNumber,
            formData: UPSObj,
            specialInstructions,
          };
        } else if (selectedShipper === "Will Call") {
          payload = {
            whoPaysShippping: "Customer Pays Freight",
            shipper: selectedShipper,
            formData: WillCallObj,
            specialInstructions,
          };
        } else if (selectedShipper === "Prepay and Add") {
          payload = {
            whoPaysShippping: "Customer Pays Freight",
            shipper: selectedShipper,
            formData: {},
            specialInstructions,
          };
        } else {
          payload = {
            whoPaysShippping: "Customer Pays Freight",
            shipper: FedEx,
            formData: FedExObj,
            specialInstructions,
          };
        }
      } else {
        payload = {};
        payload.shipper = "Prepaid LTL";
        payload.specialInstructions = specialInstructions;
        payload.whoPaysShippping = "Sellars Pays Freight";
      }
      raw = JSON.stringify({
        checkoutId: cartId,
        whoPaysShipping:
          whoPaysShippping === "Customer Pays Freight"
            ? "Customer Pays Freight"
            : "Sellars Pays Freight",
        metafields: payload,
      });
    }

    const myHeaders = new Headers();

    myHeaders.append("Content-Type", "application/json");
    myHeaders.append("Access-Control-Allow-Origin", "*");

    try {
      //https://sam-bc-sandbox.azurewebsites.net/api/updateproductprices
      //https://sam-bcapps-prod.azurewebsites.net/api/updateproductprices
      const res = await fetch(
        `https://sam-bc-sandbox.azurewebsites.net/api/updateproductprices`,
        {
          method: "POST",
          headers: myHeaders,
          body: raw,
          redirect: "follow",
        }
      );

      if (!res.ok) {
        throw new Error(`HTTP error! Status: ${res.status}`);
      }

      const data = await res.json();
      return { success: true };
      // console.log("updated cart prices and metafield data returned: ", data);
    } catch (error) {
      // Handle any errors that occur during the fetch or JSON parsing
      toast.error("Error in updating the cart Price, Try again!");
      sendMessage();
      //console.error("Error updating cart prices:", error);
      return { success: false };
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (whoPaysShippping === "Sellars Pays Freight") {
      payload = {
        whoPaysShippping,
        shipper: sellarsShipper,
        specialInstructions,
      };
    } else if (whoPaysShippping === "Customer Pays Freight") {
      if (selectedShipper === "FedEx") {
        payload = {
          whoPaysShippping,
          shipper: selectedShipper,
          specialInstructions,
          formData: FedExObj,
          AccountNumber: accountNumber,
        };
      } else if (selectedShipper === "Customer Preferred Carrier") {
        payload = {
          whoPaysShippping,
          shipper: selectedShipper,
          AccountNumber: accountNumber,
          formData: customerPreferredObj,
          specialInstructions,
        };
      } else if (selectedShipper === "UPS") {
        payload = {
          whoPaysShippping,
          shipper: selectedShipper,
          AccountNumber: accountNumber,
          formData: UPSObj,
          specialInstructions,
        };
      } else if (selectedShipper === "Will Call") {
        payload = {
          whoPaysShippping,
          shipper: selectedShipper,
          formData: WillCallObj,
          specialInstructions,
        };
      } else if (selectedShipper === "Prepay and Add") {
        payload = {
          whoPaysShippping,
          shipper: selectedShipper,
          formData: {},
          specialInstructions,
        };
      }
    }
    // console.log(payload);
    showLoadingIndicator();
    //post message to parent window - hide continue button
    sendMessage();
    try {
      const result = await UpdateCartPrice(cartId);
      //if api call success then only show continue button
      if (result.success) {
        extensionService.post({
          type: ExtensionCommandType.ReloadCheckout,
        });
        //change to your store url
        window.top.postMessage(
          "show-checkout-shipping-continue",
          "https://sellars-absorbent-materials-sandbox-1.mybigcommerce.com/"
        );
      } else {
        console.error("Failed to update cart price:");
        sendMessage();
      }
    } catch (e) {
      sendMessage();
      toast.error("UpdateCartPrice failed, Pls try later!");
      //console.log("UpdateCartPrice failed", e);
    }

    await sleep(1000);
    hideLoadingIndicator();
  };

  //this is from script manager
  async function updateCartPriceWithMeatfields(prevMetafields) {
    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    let raw;
    if (prevMetafields) {
      raw = JSON.stringify(prevMetafields);
    } else {
      raw = JSON.stringify({
        checkoutId: cartId,
        whoPaysShipping: "Customer Pays Freight",
        metafields: {
          whoPaysShipping: "Customer Pays Freight",
          shipper: "Prepay and Add",
          formData: {},
          specialInstructions,
        },
      });
    }

    const requestOptions = {
      method: "POST",
      headers: myHeaders,
      body: raw,
      redirect: "follow",
    };

    try {
      //https://sam-bc-sandbox.azurewebsites.net/api/updateproductprices
      //https://sam-bcapps-prod.azurewebsites.net/api/updateproductprices
      const response = await fetch(
        "https://sam-bc-sandbox.azurewebsites.net/api/updateproductprices",
        requestOptions
      );
      //const result = await response.text();
    } catch (error) {
      toast.error("Error in updating cart price");
      //console.error("Error updating cart price:", error);
      sendMessage();
    }
  }

  async function updatePrice(prevMetafields) {
    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    const requestOptions = {
      method: "POST",
      headers: myHeaders,
      body: JSON.stringify(prevMetafields),
      redirect: "follow",
    };

    try {
      const response = await fetch(
        "https://sam-bc-sandbox.azurewebsites.net/api/updateproductprices",
        requestOptions
      );

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      if (extensionService) {
        extensionService.post({
          type: ExtensionCommandType.ReloadCheckout,
        });
        console.log("fired reload checkout feature");
      }

      //const result = await response.text();
    } catch (error) {
      toast.error("Error in updating cart price with existing metafields");
      console.log("Error updating cart price with existing metafields:", error);
    }
  }

  async function fetchCustomer(cartIdFromURL) {
    let myHeaders2 = new Headers();
    let raw3 = JSON.stringify({
      cartId: cartIdFromURL,
    });
    myHeaders2.append("Content-Type", "application/json");
    myHeaders2.append("Access-Control-Allow-Origin", "*");
    try {
      const response = await fetch(
        `http://localhost:3000/getCart`,
        {
          method: "POST",
          headers: myHeaders2,
          body: raw3,
          redirect: "follow",
        }
      );

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const data = await response.json();
      if (data?.status === 200) {
        // Check customer group, and if it's 'BindGrp', set the flag and return a meaningful value
        if (data?.hasExcluding === false) {
          shouldRender = true;
          //setflagForRender(true);
          // Enable the continue button on the checkout page
          window.top.postMessage(
            "show-checkout-shipping-continue",
            "https://sellars-absorbent-materials-sandbox-1.mybigcommerce.com/"
          );
          //return break message to parent function so that it should not reload chekcout extention callbacks
          return "stopProcessing";
        }
        // Return a message to indicate checkout can proceed normally
        //if not bindgrp do not render empty fragment
        shouldRender=false;
        return "proceedWithCheckout";
      }
    } catch (error) {
      console.error("There was a problem with the fetch operation:", error);
    }
  }

  useEffect(() => {
    checkoutKitLoader.load("extension").then(async function (module) {
      const params = new URL(document.location).searchParams;
      const extensionId = params.get("extensionId");
      const parentOrigin = params.get("parentOrigin");
      //k
      cartId = params.get("cartId");
      let raw2 = JSON.stringify({
        cartId: cartId,
      });

      let referrer = document.referrer;
      //remove last trailing slash form referrer - https://sellars-absorbent-materials-sandbox-1.mybigcommerce.com//
      referrer = referrer.slice(0, -1);

      //parentOrigin: https://sellarspro.com
      //parentOrigin: https://sellars-absorbent-materials-sandbox-1.mybigcommerce.com/

      if (referrer !== parentOrigin) {
        shouldRender = true;
        setflagForRender(true);
        //alert("Access Denied");
        return;
      }
      // //https://sellarspro.com
      if (
        referrer !==
          "https://sellars-absorbent-materials-sandbox-1.mybigcommerce.com" ||
        parentOrigin !==
          "https://sellars-absorbent-materials-sandbox-1.mybigcommerce.com"
      ) {
        shouldRender = true;
        setflagForRender(true);
        //alert("Access Denied");
        return;
      }

      async function fetchData() {
        let myHeaders2 = new Headers();

        myHeaders2.append("Content-Type", "application/json");
        myHeaders2.append("Access-Control-Allow-Origin", "*");
        try {
          //https://sam-bc-sandbox.azurewebsites.net/api/getCartMetaFields
          //https://sam-bcapps-prod.azurewebsites.net/api/getCartMetaFields
          const response = await fetch(
            `https://sam-bc-sandbox.azurewebsites.net/api/getCartMetaFields`,
            {
              method: "POST",
              headers: myHeaders2,
              body: raw2,
              redirect: "follow",
            }
          );

          if (!response.ok) {
            throw new Error("Network response was not ok");
          }

          const data = await response.json();
          // if metafields exist update the cart value with existed metafields
          // if (data?.success === true && data?.data?.data[0]?.value) {
          //   let meta1 = JSON.parse(data?.data?.data[0]?.value);
          //   metafields = meta1?.metafields;
          // }

          if (data?.success === true) {
            let shippingNamespaceObj = data?.data?.data?.find(
              (item) => item.namespace === "sellars-shipping"
            );
            let prevPayload;
            if (shippingNamespaceObj) {
              prevPayload = JSON.parse(shippingNamespaceObj?.value);
              metafields = prevPayload?.metafields;
              prevMetafieldsPayload = prevPayload;
            }
          }

          // setFlag((prev) => !prev);
        } catch (error) {
          //if getCartMetafields fails then do nothing as it won't affect our flow
          console.error("There was a problem with the fetch operation:", error);
        }
      }

      //Fetch the cartTotal
      async function fetchCartTotal() {
        let myHeaders2 = new Headers();

        myHeaders2.append("Content-Type", "application/json");
        myHeaders2.append("Access-Control-Allow-Origin", "*");
        try {
          const response = await fetch(
            `https://sam-bc-sandbox.azurewebsites.net/api/updatecartpricemetafields`,
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                "Access-Control-Allow-Origin": "*",
              },
              body: JSON.stringify({ cartId: cartId }),
              redirect: "follow",
            }
          );

          if (!response.ok) {
            throw new Error("Network response was not ok");
          }

          const data = await response.json();
          // if(data?.status === 200){
          cartTotal = data?.cartTotal;
          // }
          //setFlag((prev) => !prev);
        } catch (error) {
          toast.error("Failed to fetch CartToal, Try again");
          console.error("There was a problem with the fetch operation:", error);
        }
      }

      

      setCheckoutid(cartId);

      try {
        extensionService = await module.initializeExtensionService({
          extensionId,
          parentOrigin,
          taggedElementId: "container",
        });
      } catch (error) {
        console.error("Extension service failed to load by Bigcommerce", error);
      }



      // Execute fetchCustomer and fetchData in parallel
      const [customerFetchResult] = await Promise.all([
        fetchCustomer(cartId), // Fetch customer data
        fetchData(),   // Fetch CartMetaFields data concurrently
      ]);

      // If fetchCustomer returns "stopProcessing", halt further operations
      if (customerFetchResult === "stopProcessing") {
        console.log("Processing stopped due to customer group BindGrp.");
        return;
      }

      // Update ProductPrices with prevPayload if available
      if (prevMetafieldsPayload) {
        updatePrice(prevMetafieldsPayload);
      }
      await fetchCartTotal()
      setFlag((prev) => !prev);





      // // Call fetchCustomer and check its result before proceeding
      // customerFetchResult = await fetchCustomer(cartId);
      // //Call fetchData() after fetching the customer
      // await fetchData();

      // // If fetchCustomer returns "stopProcessing" or any relevant return value, halt further operations
      // if (customerFetchResult === "stopProcessing") {
      //   console.log("Processing stopped due to customer group BindGrp.");
      //   return;
      // }

      // //update ProductPrices with prevPayload
      // if (prevMetafieldsPayload) {
      //   updatePrice(prevMetafieldsPayload);
      // }

      // await fetchCartTotal();

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
  
            const priceUpdateNeeded = compareConsignments(
              data?.payload?.consignments,
              data?.payload?.previousConsignments
            );
            if (priceUpdateNeeded) {
              consignmentUpdateTriggered(extensionService, cartId, data);
              //console.log("reload checkout with updated price.");
              extensionService.post({
                type: ExtensionCommandType.ReloadCheckout,
              });
            } else {
              //console.log("Key Consignment fields(country, state, shipping option) not updated, no need to trigger price update.");
            }
            await sleep(1000);
            hideLoadingIndicator();
            sendMessage();
          }
        );
      }
     

      
    });

    //hide checkout at initial load
    if (customerFetchResult !== "stopProcessing") {
      sendMessage();
    }
   
  }, []);

  return (
    <>
      {shouldRender === true ? (
        <div id="container"></div>
      ) : (
        <div id="container">
          <div>
            <form fullWidth onSubmit={handleSubmit}>
              <div>
                <div style={{ marginBottom: "5px" }}>Who Pays Shipping</div>
                <Select
                  fullWidth
                  required
                  style={{ marginBottom: "10px" }}
                  value={whoPaysShippping}
                  onChange={handleShippingChange}
                  data-testid="whoPaysShipping"
                >
                  {cartTotal > 1000 && (
                    <MenuItem value="Sellars Pays Freight">
                      Sellars Pays Freight
                    </MenuItem>
                  )}

                  <MenuItem value="Customer Pays Freight">
                    Customer Pays Freight
                  </MenuItem>
                </Select>
              </div>

              {whoPaysShippping === "Sellars Pays Freight" &&
              cartTotal > 1000 ? (
                <div>
                  <div style={{ marginBottom: "5px" }}>Shipper To Use</div>
                  <Select
                    style={{ marginBottom: "20px" }}
                    fullWidth
                    required
                    value={sellarsShipper}
                    onChange={handleSellersShipperChange}
                    name=""
                  >
                    <MenuItem value="Prepaid LTL">Prepaid LTL</MenuItem>
                  </Select>
                </div>
              ) : (
                <>
                  <div>
                    <div style={{ marginBottom: "5px" }}>Shipper To Use</div>

                    <Select
                      data-testid=""
                      style={{ marginBottom: "20px" }}
                      fullWidth
                      value={selectedShipper}
                      onChange={handleShipperChange}
                    >
                      <MenuItem
                        sx={{
                          fontSize: "1em",
                          "@media (max-width: 600px)": {
                            fontSize: "0.9rem", // Decrease font size on mobile
                          },
                        }}
                        value="FedEx"
                      >
                        FedEx{" "}
                        <span className="case-restriction">
                          (12 cases or less)
                        </span>
                      </MenuItem>
                      <MenuItem
                        sx={{
                          fontSize: "1em",
                          "@media (max-width: 600px)": {
                            fontSize: "0.9rem", // Decrease font size on mobile
                          },
                        }}
                        value="Customer Preferred Carrier"
                      >
                        Customer Preferred Carrier
                        <span className="case-restriction">
                          (13 cases or more)
                        </span>
                      </MenuItem>
                      <MenuItem
                        sx={{
                          fontSize: "1em",
                          "@media (max-width: 600px)": {
                            fontSize: "0.9rem", // Decrease font size on mobile
                          },
                        }}
                        value="UPS"
                      >
                        UPS{" "}
                        <span className="case-restriction">
                          (12 cases or less)
                        </span>
                      </MenuItem>
                      <MenuItem
                        sx={{
                          fontSize: "1em",
                          "@media (max-width: 600px)": {
                            fontSize: "0.9rem", // Decrease font size on mobile
                          },
                        }}
                        value="Will Call"
                      >
                        Will Call
                      </MenuItem>
                      <MenuItem
                        sx={{
                          fontSize: "1em",
                          "@media (max-width: 600px)": {
                            fontSize: "0.8rem", // Decrease font size on mobile
                          },
                        }}
                        value="Prepay and Add"
                      >
                        Prepay and Add
                      </MenuItem>
                    </Select>
                  </div>
                  {isDisplayingAccountNumber === "Customer Preferred Carrier" ||
                  isDisplayingAccountNumber === "UPS" ||
                  isDisplayingAccountNumber === "FedEx" ? (
                    <div style={{ marginBottom: "20px" }}>
                      <TextField
                        fullWidth
                        label="Account Number"
                        variant="outlined"
                        required
                        value={accountNumber}
                        onChange={(e) => {
                          sendMessage();
                          accountNumberGlobal = e.target.value;
                          setAccountNumber(e.target.value);
                        }}
                      />
                    </div>
                  ) : null}

                  <div>
                    <Grid container spacing={3}>
                      {Object.entries(FormFields).map(
                        ([fieldName, fieldType]) => (
                          <Grid item key={fieldName} fullWidth sm={6}>
                            {renderFormField(
                              fieldName,
                              fieldType,
                              fieldType?.formName,
                              fieldType?.fieldOptions
                            )}
                          </Grid>
                        )
                      )}
                    </Grid>
                  </div>
                </>
              )}

              <div>
                <div style={{ marginTop: "10px" }}>
                  <label htmlFor="specialInstructions">
                    Special Instructions
                  </label>
                </div>
                <textarea
                  name="specialInstructions"
                  id="specialInstructions"
                  onChange={(e) => {
                    sendMessage();
                    setSpecialInstructions(e.target.value);
                  }}
                  rows={4} // Set the number of visible text lines
                  cols={25} // Set the number of visible text columns
                />
              </div>
              <button
                id="checkout-submit"
                style={{
                  backgroundColor: "black",
                  color: "white",
                  padding: "10px 30px",
                  borderRadius: "5px",
                  border: "none",
                  cursor: "pointer",
                  fontSize: "16px",
                  fontWeight: "bold",
                  marginTop: "15px",
                }}
                type="submit"
              >
                Submit Shipping Options
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default CustomForm;