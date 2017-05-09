
function checkStatus(response) {
  if (response.status >= 200 && response.status < 300) {
    return response;
  }
  const error = new Error(response.statusText);
  error.response = response;
  throw error;
};
export default async (url, dt) => {
  console.log(url, "API request --",dt)
  const response = await fetch(url, {method: "POST",body:JSON.stringify(dt)});
  checkStatus(response);
  const res = await response.json();
  console.log(url.split('?')[0], "API return  --",res)
  return res;
};
