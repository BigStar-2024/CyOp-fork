import { ethers, BigNumber } from "ethers";

export const datetime2str = (date: Date | string | number | undefined): string => {
  if (date === undefined) return "";
  const cTime = new Date(date);

  return (
    cTime.getFullYear() +
    "-" +
    ("0" + (cTime.getMonth() + 1)).slice(-2) +
    "-" +
    ("0" + cTime.getDate()).slice(-2) +
    " " +
    ("0" + cTime.getHours()).slice(-2) +
    "-" +
    ("0" + cTime.getMinutes()).slice(-2) +
    "-" +
    ("0" + cTime.getSeconds()).slice(-2)
  );
};

export const date2str = (date: Date | string | number | undefined): string => {
  if (date === undefined) return "";
  const cTime = new Date(date);

  return cTime.getFullYear() + "-" + ("0" + (cTime.getMonth() + 1)).slice(-2) + "-" + ("0" + cTime.getDate()).slice(-2);
};

export const time2str = (date: Date | string | number | undefined): string => {
  if (date === undefined) return "";
  const cTime = new Date(date);

  return (
    ("0" + cTime.getHours()).slice(-2) +
    "-" +
    ("0" + cTime.getMinutes()).slice(-2) +
    "-" +
    ("0" + cTime.getSeconds()).slice(-2)
  );
};

export const commaValue = (val: string | number | undefined, decimal?: number): string => {
  if (val === undefined) return "";

  let num = typeof val === "string" ? parseFloat(val) : val;

  var parts = num.toFixed(decimal).split(".");
  parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  return parts.join(".");
};

export const str2number = (val: string | undefined): number => {
  if (val == null) return 0;

  let num = Number(val);

  if (num == null) return 0;
  return num;
};

export const simplifiedWalletAddress = (_address: any) => {
  if (!_address) return "";
  const address = _address.toString();
  return address.slice(0, 6) + "..." + address.slice(-4);
};

export const formatUnits = (
  val: BigNumber | number,
  decimal: number, // number of decimal
  commify: boolean = true
): string => {
  let amount = ethers.utils.formatUnits(val, decimal);
  let commified = "";
  if (commify) {
    commified = ethers.utils.commify(amount);
  } else {
    commified = amount;
  }

  let parts = commified.split(".");
  let integerPart = parts[0];
  let decimalPart = parts[1];
  if (decimalPart === "0") {
    return integerPart;
  } else {
    return commified;
  }
};

export const parseCommified = (val: string): number => {
  if (!val) return 0;
  val = val.replaceAll(",", "");
  let result = parseFloat(val);
  return result;
};

export const toFixedNoRounding = function (num: number, digits: number = 0) {
  var re = new RegExp("(\\d+\\.\\d{" + digits + "})(\\d)"),
    m = num.toString().match(re);
  return m ? parseFloat(m[1]) : num.valueOf();
};

export const isValidContractAddress = (value: string) => {
  if (!value) {
    return { isValid: false, validationError: "No Address Provided" };
  }
  const isValidAddress = ethers.utils.isAddress(value);
  return { isValid: isValidAddress, validationError: "Invalid Address" };
};

export const isValidYoutubeLink = (value: string) => {
  try {
    if (value) {
      extractYoutubeId(value);
      return { isValid: true, validationError: "" };
    } else {
      return { isValid: false, validationError: "No Youtube Link Provided" };
    }
  } catch (e) {
    return { isValid: false, validationError: "Invalid Youtube Link" };
  }
};

export const extractYoutubeId = (value: string) => {
  let ID: string[] | string = "";
  let url: string[] | string = value.replace(/(>|<)/gi, "").split(/(vi\/|v=|\/v\/|youtu\.be\/|\/embed\/)/);
  if (url[2] !== undefined) {
    ID = url[2].split(/[^0-9a-z_\-]/i)[0];
  } else {
    ID = url;
  }
  return ID;
};

export const isValidWebsite = (value: string) => {
  if (value) {
    const rgx = new RegExp(
      "^(https?:\\/\\/)?" + // validate protocol
        "((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|" + // validate domain name
        "((\\d{1,3}\\.){3}\\d{1,3}))" + // validate OR ip (v4) address
        "(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*" + // validate port and path
        "(\\?[;&a-z\\d%_.~+=-]*)?" + // validate query string
        "(\\#[-a-z\\d_]*)?$",
      "i"
    ); // validate fragment locator
    return { isValid: !!rgx.test(value), validationError: "Invalid Website" };
  }
  return { isValid: false, validationError: "No Website Provided " };
};

export const isWholeNumber = (value: string) => {
  if (value) {
    return Number.isInteger(Number(value));
  }
  return false;
};

export const isValidTokenName = (value: string, maxLen: number) => {
  if (!value) return { isValid: false, validationError: "No Token Provided" };
  return { isValid: value.length <= maxLen, validationError: `Token should be less than ${maxLen} symbols` };
};

export const isValidFileName = (value: string, maxLen: number) => {
  if (!value) return { isValid: false, validationError: "No Title Provided" };
  return { isValid: value.length <= maxLen, validationError: `Title should be less than ${maxLen} symbols` };
};

export const isValidDescription = (value: string, maxLen: number) => {
  if (!value) return { isValid: false, validationError: "No Description Provided" };
  return { isValid: value.length <= maxLen, validationError: `Description should be less than ${maxLen} symbols` };
};

export const isValidDetailedDescription = (value: string, maxLen: number) => {
  if (!value) return { isValid: false, validationError: "No Detailed Description Provided" };
  return {
    isValid: value.length <= maxLen,
    validationError: `Detailed description should be less than ${maxLen} symbols`
  };
};

export const timeAgo = (time: number | string | Date) => {
  switch (typeof time) {
    case "number":
      break;
    case "string":
      time = +new Date(time);
      break;
    case "object":
      if (time.constructor === Date) time = time.getTime();
      break;
    default:
      time = +new Date();
  }
  const timeFormats = [
    [60, "seconds", 1], // 60
    [120, "1 minute ago", "1 minute from now"], // 60*2
    [3600, "minutes", 60], // 60*60, 60
    [7200, "1 hour ago", "1 hour from now"], // 60*60*2
    [86400, "hours", 3600], // 60*60*24, 60*60
    [172800, "Yesterday", "Tomorrow"], // 60*60*24*2
    [604800, "days", 86400], // 60*60*24*7, 60*60*24
    [1209600, "Last week", "Next week"], // 60*60*24*7*4*2
    [2419200, "weeks", 604800], // 60*60*24*7*4, 60*60*24*7
    [4838400, "Last month", "Next month"], // 60*60*24*7*4*2
    [29030400, "months", 2419200], // 60*60*24*7*4*12, 60*60*24*7*4
    [58060800, "Last year", "Next year"], // 60*60*24*7*4*12*2
    [2903040000, "years", 29030400], // 60*60*24*7*4*12*100, 60*60*24*7*4*12
    [5806080000, "Last century", "Next century"], // 60*60*24*7*4*12*100*2
    [58060800000, "centuries", 2903040000] // 60*60*24*7*4*12*100*20, 60*60*24*7*4*12*100
  ];
  let seconds = (+new Date() - +time) / 1000,
    token = "ago",
    list_choice = 1;

  if (seconds === 0) {
    return "Just now";
  }
  if (seconds < 0) {
    seconds = Math.abs(seconds);
    token = "from now";
    list_choice = 2;
  }
  let i = 0,
    format;
  while ((format = timeFormats[i++]))
    if (seconds < format[0]) {
      if (typeof format[2] == "string") return format[list_choice];
      else return Math.floor(seconds / format[2]) + " " + format[1] + " " + token;
    }
  return time;
};

export const intToString = (num: number) => {
  num = parseFloat(num.toString());
  if (Math.abs(num) < 1000) {
    return num;
  }
  let si = [
    { v: 1e3, s: "K" },
    { v: 1e6, s: "M" },
    { v: 1e9, s: "B" },
    { v: 1e12, s: "T" },
    { v: 1e15, s: "P" },
    { v: 1e18, s: "E" }
  ];
  let index;
  for (index = si.length - 1; index > 0; index--) {
    if (Math.abs(num) >= si[index].v) {
      break;
    }
  }
  return (num / si[index].v).toFixed(2).replace(/\.0+$|(\.[0-9]*[1-9])0+$/, "$1") + si[index].s;
};
