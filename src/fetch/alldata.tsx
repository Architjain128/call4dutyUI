const BK_URL = "https://qa6-call-for-duty-global.sprinklr.com"

const fetchData = async () => {
    try {
      const response = await fetch(BK_URL); // Example API call
      const result = await response.json();
      console.log(result)


    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
    }
  };