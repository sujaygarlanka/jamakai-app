export default function reducer(
  state = {
    uploadEndpoint: "http://jamakai.herokuapp.com/digits"
  },
  action
) {
  switch (action.type) {
    case "SET":
      return { ...state, ...action.data };
  }
  return state;
}
