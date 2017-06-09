import axios from 'axios';

export default SetProfile = (context, userId) => {

  console.log("The userId inside SetProfile.js is ", userId);
  
  //get the user's info by Id
  axios.get(`http://homemadeapp.org:3000/user/${userId}`).then(user => {
    
    console.log("the user inside axiospost for SetProfile.js is ", user);

    context.setState({
      user: user.data[0],
      chefReviews: user.data[0].chefReviews,
      customerReviews: user.data[0].customerReviews,
      status: user.data[0].status,
      isChef: user.data[0].isChef,
      likes: user.data[0].likes,
      _id: user.data[0]._id
    });

    }).catch(error => {
      console.log("Error inside axios get user for SetProfile.js is ", error);
    });

  //Get the dishes by userId
  axios.get(`http://homemadeapp.org:3000/dish/1/${userId}`).then(dishes => {
    console.log("Dishes by userId inside Axios get in SetProfile.js are ", dishes)    
    var activeDishes = dishes.data; //array of objs
    
    context.setState({menu: activeDishes});    

    }).catch(error => {
    console.log("Error inside Axios get dishes for SetProfile.js is ", error);
  });
}