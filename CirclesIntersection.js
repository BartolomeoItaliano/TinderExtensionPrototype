function Point(px, py, pz) {
    this.x = px;
    this.y = py;
    this.z = pz;
}

var CrclInt = {

    //Trilateration error come from quantisation in trilateration alghoritm
    //AND
    //moveAndEstimateDistanceOnFakeData function
    myTrilaterate: function (PECartCordsVector1, PECartCordsVector2, PECartCordsVector3) {
        var maxX = PECartCordsVector1.cartCoordinatesVector.x + PECartCordsVector1.distance + 1;
        var minX = PECartCordsVector1.cartCoordinatesVector.x - PECartCordsVector1.distance - 1;
        var maxY = PECartCordsVector1.cartCoordinatesVector.y + PECartCordsVector1.distance + 1;
        var minY = PECartCordsVector1.cartCoordinatesVector.y - PECartCordsVector1.distance - 1;

        // console.log("Conversion test: ", SphCrtConverter.convertCartesianToSpherical(PECartCordsVector1.cartCoordinatesVector));

        var movingPoint = new CartesianCoordinatesVector(minX, minY);
        //Point Of Closest Approach
        var POCA = movingPoint;
        var minError = 9999999999;

        while (movingPoint.y < maxY) {
            while (movingPoint.x < maxX) {

                //=========================First Sphere point=============================
                movingPoint.z = SphCrtConverter.getSpherePoints(movingPoint.x, movingPoint.y, PECartCordsVector1)[0];
                if (movingPoint.z != movingPoint.z) {
                    movingPoint.x += 0.15;
                    continue;
                }
                var dst2 = Math.abs(PECartCordsVector2.distance  - FakeDateProvider.calculateDistanceBeetwenTwoPoints_InMiles(SphCrtConverter.convertCartesianToSpherical(movingPoint).theta,SphCrtConverter.convertCartesianToSpherical(movingPoint).phi,
                        SphCrtConverter.convertCartesianToSpherical(PECartCordsVector2.cartCoordinatesVector).theta,SphCrtConverter.convertCartesianToSpherical(PECartCordsVector2.cartCoordinatesVector).phi));
                var dst3 = Math.abs(PECartCordsVector3.distance  - FakeDateProvider.calculateDistanceBeetwenTwoPoints_InMiles(SphCrtConverter.convertCartesianToSpherical(movingPoint).theta,SphCrtConverter.convertCartesianToSpherical(movingPoint).phi,
                        SphCrtConverter.convertCartesianToSpherical(PECartCordsVector3.cartCoordinatesVector).theta,SphCrtConverter.convertCartesianToSpherical(PECartCordsVector3.cartCoordinatesVector).phi));


                var error = dst2 + dst3;
                if (error < minError) {
                    minError = error;
                    POCA = new CartesianCoordinatesVector(movingPoint.x, movingPoint.y, movingPoint.z);
                }

                //=========================First Sphere point=============================
                movingPoint.z = SphCrtConverter.getSpherePoints(movingPoint.x, movingPoint.y, PECartCordsVector1)[1];
                if (movingPoint.z != movingPoint.z) {
                    movingPoint.x += 0.15;
                    continue;
                }
                var dst2 = this.getPointsDistance(movingPoint, PECartCordsVector2.cartCoordinatesVector);
                var dst3 = this.getPointsDistance(movingPoint, PECartCordsVector3.cartCoordinatesVector);
                error = dst2 + dst3;
                if (error < minError) {
                    minError = error;
                    POCA = new CartesianCoordinatesVector(movingPoint.x, movingPoint.y, movingPoint.z);
                }


                movingPoint.x += 0.15;
            }
            movingPoint.x = minX;
            movingPoint.y += 0.15;
        }

        console.log("POCA", POCA, "min Error: ", minError);
        console.log("POCA", SphCrtConverter.convertCartesianToSpherical(POCA));
        return POCA;
    },

    getPointsDistance: function (point1, point2) {
        return Math.sqrt(Math.pow((point1.x - point2.x), 2) + Math.pow((point1.y - point2.y), 2) + Math.pow((point1.z - point2.z), 2));
    }
}
console.log("distance of point (5,0,0) and (0,0,0)", CrclInt.getPointsDistance({x: 5, y: 0, z: 0}, {x: 0, y: 0, z: 0}));
console.log("distance of point (0,5,0) and (0,0,0)", CrclInt.getPointsDistance({x: 0, y: 5, z: 0}, {x: 0, y: 0, z: 0}));
console.log("distance of point (0,5,0) and (5,5,0)", CrclInt.getPointsDistance({x: 0, y: 5, z: 0}, {x: 0, y: 0, z: 0}));
console.log("distance of point (0,5,0) and (5,5,0)", CrclInt.getPointsDistance({x: 0, y: 5, z: 0}, {x: 0, y: 0, z: 0}));
// var PECartCordsVector1 = {cartCoordinatesVector: {x: 5, y: 0, z: 0}, distance: 5};
// var PECartCordsVector2 = {cartCoordinatesVector: {x: 0, y: 5, z: 0}, distance: 5};
// var PECartCordsVector3 = {cartCoordinatesVector: {x: -5, y: 0, z: 0}, distance: 5};
//console.log("trilaterate test they should cross in 0,0,0", CrclInt.myTrilaterate(PECartCordsVector1, PECartCordsVector2, PECartCordsVector3));
//wezme na sferycznych prosty przyklad i bedzie

