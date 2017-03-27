


var FakeDateProvider={
    getDistance: function(sphericalCoordinatesVector){
        var girlLocation={
            lat: 50,
            lng: 19
        }

        return Math.round(this.calculateDistanceBeetwenTwoPoints_InMiles(girlLocation.lat,girlLocation.lng,sphericalCoordinatesVector.theta,sphericalCoordinatesVector.phi));
        //return this.calculateDistanceBeetwenTwoPoints_InMiles(girlLocation.lat,girlLocation.lng,sphericalCoordinatesVector.theta,sphericalCoordinatesVector.phi);
    },

    calculateDistanceBeetwenTwoPoints_InMiles: function(latitude1, longitude1, latitude2, longitude2){
        var latitudesDelta=(latitude2-latitude1)/360*2*Math.PI;
        var longitudeDelta=(longitude2-longitude1)/360*2*Math.PI;
        var meanLatitude=((latitude1+latitude2)/2)/360*2*Math.PI;
        return 3958.761*Math.sqrt(Math.pow(latitudesDelta,2)+Math.pow((Math.cos(meanLatitude)*longitudeDelta),2));
    }
}


//console.log(FakeDateProvider.getDistance({theta:(50-0.0002),phi:19}));