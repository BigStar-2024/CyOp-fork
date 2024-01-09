const backendUrl = process.env.REACT_APP_BACKEND_URL!;

const urls = {
    backend: backendUrl,
    cyops: backendUrl + "cyoperations",
    cyopsFiltered: backendUrl + "cyoperations/filtered",
    cyopsTo: backendUrl + "cyoperations/to",
    cyopsFilteredTo: backendUrl + "cyoperations/filtered/to",
    cyoperation: backendUrl + "cyoperation",
    vote: backendUrl + "vote",
    login: backendUrl + "login",
    users: backendUrl + "users",
    votes: backendUrl + "votes",
    votesFiltered: backendUrl + "votes/filtered",
    winningCyOps: backendUrl + "cyoperations/winners",
    allWinners: backendUrl + "cyoperations/winners/all",
    rewards: backendUrl + "rewards",
    participations: backendUrl + "participations",
    addCyoperation: backendUrl + "cyoperations/create",
    cycleResults: backendUrl + "cycle/results",
    totalAmount: backendUrl + "totalAmount",
    getTicket: backendUrl + "ticket",
    computeWinners: backendUrl + "cycle/end",
    activeUnfts: backendUrl + "unfts/active",
    unftsMetadata: backendUrl + "unfts/metadata"
};
  
export default urls;
  