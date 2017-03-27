function CartesianCoordinatesVector(x, y, z) {
    this.x = x;
    this.y = y;
    this.z = z;
}

function SphericalCoordinatesVector(r, theta, phi) {
    this.r = r;
    this.theta = theta;
    this.phi = phi;
}

var SphCrtConverter = {
    convertCartesianToSpherical: function (cartesianCoordinatesVector) {
        // if (!(CartesianCoordinatesVector.prototype.isPrototypeOf(cartesianCoordinatesVector))) {
        //     console.error("cartesianVector is not an instance of CartesianCoordinatesVector class");
        // }
        var sphericalCoordinatesVector = new SphericalCoordinatesVector();
        sphericalCoordinatesVector.r = Math.sqrt(cartesianCoordinatesVector.x * cartesianCoordinatesVector.x + cartesianCoordinatesVector.y * cartesianCoordinatesVector.y + cartesianCoordinatesVector.z * cartesianCoordinatesVector.z);
        sphericalCoordinatesVector.theta = Math.acos(cartesianCoordinatesVector.z / sphericalCoordinatesVector.r)*180/Math.PI;
        sphericalCoordinatesVector.phi = Math.atan(cartesianCoordinatesVector.y / cartesianCoordinatesVector.x)*180/Math.PI;
        return sphericalCoordinatesVector;
    },

    convertSphericalToCartesian: function (sphericalCoordinatesVector) {
        // if (!(SphericalCoordinatesVector.prototype.isPrototypeOf(sphericalCoordinatesVector))) {
        //     console.error("sphericalCoordinatesVector is not an instance of SphericalCoordinatesVector class");
        // }
        var cartesianCoordinatesVector = new CartesianCoordinatesVector();
        cartesianCoordinatesVector.x = sphericalCoordinatesVector.r * Math.sin(sphericalCoordinatesVector.theta*Math.PI/180) * Math.cos(sphericalCoordinatesVector.phi*Math.PI/180);
        cartesianCoordinatesVector.y = sphericalCoordinatesVector.r * Math.sin(sphericalCoordinatesVector.theta*Math.PI/180) * Math.sin(sphericalCoordinatesVector.phi*Math.PI/180);
        cartesianCoordinatesVector.z = sphericalCoordinatesVector.r * Math.cos(sphericalCoordinatesVector.theta*Math.PI/180);
        return cartesianCoordinatesVector;
    },

    getSpherePoints:function (x,y,preciselyEstimatedSphericalCoordinatesVector) {
        var z1=Math.sqrt(Math.pow(preciselyEstimatedSphericalCoordinatesVector.distance,2)-
                Math.pow((x-preciselyEstimatedSphericalCoordinatesVector.cartCoordinatesVector.x),2)-
                Math.pow((y-preciselyEstimatedSphericalCoordinatesVector.cartCoordinatesVector.y),2))
            +preciselyEstimatedSphericalCoordinatesVector.cartCoordinatesVector.z;
        var z2=-Math.sqrt(Math.pow(preciselyEstimatedSphericalCoordinatesVector.distance,2)-
                Math.pow((x-preciselyEstimatedSphericalCoordinatesVector.cartCoordinatesVector.x),2)-
                Math.pow((y-preciselyEstimatedSphericalCoordinatesVector.cartCoordinatesVector.y),2))
            +preciselyEstimatedSphericalCoordinatesVector.cartCoordinatesVector.z;
        return [z1,z2];
    }
}
