const geoPoint = require("geopoint");
const axios = require("axios");

module.exports = (state, userCoords) => {
  var userGP = new geoPoint(userCoords.latitude, userCoords.longitude);

  axios
    .get("http://homemadeapp.org:3000/chefTest")
    .then(response => {
      console.log("got the chefs", response);

      var filteredChefs = [];

      response.data.forEach(chef => {
        var chefGP = new geoPoint(chef.location.geo_lat, chef.location.geo_lng);

        if (userGP.distanceTo(chefGP) <= 5) {
          filteredChefs.push(chef);
        }
      });

      console.log(
        "filteredChefs are" +
          filteredChefs +
          " and the length is " +
          filteredChefs.length
      );
      state.setState({ data: filteredChefs });
    })
    .catch(error => {
      console.log(error);
    });
};
