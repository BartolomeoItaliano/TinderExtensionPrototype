//środki okręgów umieszczę blisko granic polski

var TinderPosBr = {

    PreciselyEstimatedSphericalCoordinatesVector: function (sphericalCoordinatesVector) {
        this.sphericalCoordinatesVector = sphericalCoordinatesVector;
        this.isEstimated = false;
        this.distance = 0;
    },
    PreciselyEstimatedCartesianCoordinatesVector: function (cartCoordinatesVector) {
        this.cartCoordinatesVector = cartCoordinatesVector;
        this.isEstimated = false;
        this.distance = 0;
    },
    convertPESphToCartesianCordsVector: function (preciselyEstimatedSphericalCoordinatesVector) {
        var PECartVector = new this.PreciselyEstimatedCartesianCoordinatesVector(SphCrtConverter.convertSphericalToCartesian(preciselyEstimatedSphericalCoordinatesVector.sphericalCoordinatesVector))
        PECartVector.distance = preciselyEstimatedSphericalCoordinatesVector.distance;
        return PECartVector;
    },


    getPreciseCircles: function (sphericalCoordinatesVector) {


        if (!(SphericalCoordinatesVector.prototype.isPrototypeOf(sphericalCoordinatesVector))) {
            console.error("sphericalCoordinatesVector is not an instance of SphericalCoordinatesVector class");
        }
        var sphericalCords = [];


        sphericalCords.push(
            new this.PreciselyEstimatedSphericalCoordinatesVector(
                new SphericalCoordinatesVector(
                    sphericalCoordinatesVector.r,
                    sphericalCoordinatesVector.theta + 0.5,
                    sphericalCoordinatesVector.phi
                )
            )
        );
        sphericalCords.push(
            new this.PreciselyEstimatedSphericalCoordinatesVector(
                new SphericalCoordinatesVector(
                    sphericalCoordinatesVector.r,
                    sphericalCoordinatesVector.theta - 2.5,
                    sphericalCoordinatesVector.phi - 2.5
                )
            )
        );
        sphericalCords.push(
            new this.PreciselyEstimatedSphericalCoordinatesVector(
                new SphericalCoordinatesVector(
                    sphericalCoordinatesVector.r,
                    sphericalCoordinatesVector.theta - 2.5,
                    sphericalCoordinatesVector.phi + 2.5
                )
            )
        );

        var nmrPositionsEstablished = 0;
        var computationsDone = false;
        while (!computationsDone) {
            computationsDone = true;
            for (var i = 0; sphericalCords.length > i; i++) {
                if (!sphericalCords[i].isEstimated) {
                    computationsDone = false;
                    break;
                }
            }
            this.moveAndEstimateDistanceOnFakeData(sphericalCords);
            //If not already done do a move and compute again
        }
        // console.log("Tests result:")
        // console.log(sphericalCords);
        // console.log(FakeDateProvider.getPreciseDistance(sphericalCords[0].sphericalCoordinatesVector));
        // console.log(FakeDateProvider.getPreciseDistance(sphericalCords[1].sphericalCoordinatesVector));
        // console.log(FakeDateProvider.getPreciseDistance(sphericalCords[2].sphericalCoordinatesVector));
        // console.log("SphCrtConverter tests: ");
        // console.log(sphericalCords[0].sphericalCoordinatesVector);
        // var temp1=SphCrtConverter.convertSphericalToCartesian(sphericalCords[0].sphericalCoordinatesVector);
        // console.log(temp1);
        // console.log(SphCrtConverter.convertCartesianToSpherical(temp1));

        CrclInt.myTrilaterate(
            this.convertPESphToCartesianCordsVector(sphericalCords[0]),
            this.convertPESphToCartesianCordsVector(sphericalCords[1]),
            this.convertPESphToCartesianCordsVector(sphericalCords[2])
        )

    },

    getPreciseCirclesOnTinderWebAPI: function (sphericalCoordinatesVector) {


        if (!(SphericalCoordinatesVector.prototype.isPrototypeOf(sphericalCoordinatesVector))) {
            console.error("sphericalCoordinatesVector is not an instance of SphericalCoordinatesVector class");
        }
        var sphericalCords = [];


        sphericalCords.push(
            new this.PreciselyEstimatedSphericalCoordinatesVector(
                new SphericalCoordinatesVector(
                    sphericalCoordinatesVector.r,
                    sphericalCoordinatesVector.theta + 0.5,
                    sphericalCoordinatesVector.phi
                )
            )
        );
        sphericalCords.push(
            new this.PreciselyEstimatedSphericalCoordinatesVector(
                new SphericalCoordinatesVector(
                    sphericalCoordinatesVector.r,
                    sphericalCoordinatesVector.theta - 2.5,
                    sphericalCoordinatesVector.phi - 2.5
                )
            )
        );
        sphericalCords.push(
            new this.PreciselyEstimatedSphericalCoordinatesVector(
                new SphericalCoordinatesVector(
                    sphericalCoordinatesVector.r,
                    sphericalCoordinatesVector.theta - 2.5,
                    sphericalCoordinatesVector.phi + 2.5
                )
            )
        );

        var nmrPositionsEstablished = 0;
        var computationsDone = false;
        // while (!computationsDone) {
        //     computationsDone = true;
        //     for (var i = 0; sphericalCords.length > i; i++) {
        //         if (!sphericalCords[i].isEstimated) {
        //             computationsDone = false;
        //             break;
        //         }
        //     }
        this.moveAndEstimateDistanceWithTinderAPI(sphericalCords);
        //If not already done do a move and compute again
        // }
        CrclInt.myTrilaterate(
            this.convertPESphToCartesianCordsVector(sphericalCords[0]),
            this.convertPESphToCartesianCordsVector(sphericalCords[1]),
            this.convertPESphToCartesianCordsVector(sphericalCords[2])
        )

    },

    moveAndEstimateDistanceWithTinderAPI: function (sphericalCords) {

        if (!sphericalCords[0].isEstimated) {
            TinderWebAPI.getUserDetails('5752fa576261ae3a139e2873',
                function (res1) {
                    var dst1 = res1.results.distance_mi;
                    console.log(dst1);
                    //move about 13.818682749876442 meters
                    sphericalCords[0].sphericalCoordinatesVector.theta -= 10;
                    TinderWebAPI.tinderUpdatePosition(sphericalCords[0].sphericalCoordinatesVector.theta, sphericalCords[0].sphericalCoordinatesVector.phi,
                        function (res2) {
                            console.log(res2);
                            setTimeout(
                                function () {
                                    TinderWebAPI.getUserDetails('5752fa576261ae3a139e2873',
                                        function (res3) {
                                            var dst2 = res3.results.distance_mi;
                                            if (dst1 !== dst2) {
                                                sphericalCords[0].isEstimated = true;
                                                sphericalCords[0].distance = (dst2 + dst1) / 2;
                                            }
                                        }
                                    )
                                }, 10000
                            )
                        }
                    )
                }
            )
        }

        if (!sphericalCords[1].isEstimated) {
            var dst1 = FakeDateProvider.getDistance(sphericalCords[1].sphericalCoordinatesVector);
            //move about 13.818682749876442 meters
            sphericalCords[1].sphericalCoordinatesVector.theta += 0.0000001;
            sphericalCords[1].sphericalCoordinatesVector.phi += 0.0000001;
            var dst2 = FakeDateProvider.getDistance(sphericalCords[1].sphericalCoordinatesVector);
            if (dst1 !== dst2) {
                sphericalCords[1].isEstimated = true;
                sphericalCords[1].distance = (dst2 + dst1) / 2;
            }
        }

        if (!sphericalCords[2].isEstimated) {
            var dst1 = FakeDateProvider.getDistance(sphericalCords[2].sphericalCoordinatesVector);
            //move about 13.818682749876442 meters
            sphericalCords[2].sphericalCoordinatesVector.theta += 0.0000001;
            sphericalCords[2].sphericalCoordinatesVector.phi -= 0.0000001;
            var dst2 = FakeDateProvider.getDistance(sphericalCords[2].sphericalCoordinatesVector);
            if (dst1 !== dst2) {
                sphericalCords[2].isEstimated = true;
                sphericalCords[2].distance = (dst2 + dst1) / 2;
            }
        }
        return sphericalCords;
    },
    moveAndEstimateDistanceOnFakeData: function (sphericalCords) {
        if (!sphericalCords[0].isEstimated) {
            var dst1 = FakeDateProvider.getDistance(sphericalCords[0].sphericalCoordinatesVector);
            //move about 13.818682749876442 meters
            sphericalCords[0].sphericalCoordinatesVector.theta -= 0.0000002;
            var dst2 = FakeDateProvider.getDistance(sphericalCords[0].sphericalCoordinatesVector);
            if (dst1 !== dst2) {
                sphericalCords[0].isEstimated = true;
                sphericalCords[0].distance = (dst2 + dst1) / 2;
            }
        }

        if (!sphericalCords[1].isEstimated) {
            var dst1 = FakeDateProvider.getDistance(sphericalCords[1].sphericalCoordinatesVector);
            //move about 13.818682749876442 meters
            sphericalCords[1].sphericalCoordinatesVector.theta += 0.0000001;
            sphericalCords[1].sphericalCoordinatesVector.phi += 0.0000001;
            var dst2 = FakeDateProvider.getDistance(sphericalCords[1].sphericalCoordinatesVector);
            if (dst1 !== dst2) {
                sphericalCords[1].isEstimated = true;
                sphericalCords[1].distance = (dst2 + dst1) / 2;
            }
        }

        if (!sphericalCords[2].isEstimated) {
            var dst1 = FakeDateProvider.getDistance(sphericalCords[2].sphericalCoordinatesVector);
            //move about 13.818682749876442 meters
            sphericalCords[2].sphericalCoordinatesVector.theta += 0.0000001;
            sphericalCords[2].sphericalCoordinatesVector.phi -= 0.0000001;
            var dst2 = FakeDateProvider.getDistance(sphericalCords[2].sphericalCoordinatesVector);
            if (dst1 !== dst2) {
                sphericalCords[2].isEstimated = true;
                sphericalCords[2].distance = (dst2 + dst1) / 2;
            }
        }
        return sphericalCords;
    }

}
function getUserPositionOnFakeData() {
    TinderPosBr.getPreciseCircles(new SphericalCoordinatesVector(3958.761, 53, 19));
}

function getUserPositionOnTrueData() {
    TinderPosBr.getPreciseCirclesOnTinderWebAPI(new SphericalCoordinatesVector(3958.761, 53, 19));
}