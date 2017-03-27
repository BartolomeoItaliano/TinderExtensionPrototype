//theta to latitude

var sphCords1 = new SphericalCoordinatesVector(3958.761, 50, 20);
var cartesianCords1 = SphCrtConverter.convertSphericalToCartesian(sphCords1);
var circle1 = {
    x: cartesianCords1.x,
    y: cartesianCords1.y,
    z: cartesianCords1.z,
    r: FakeDateProvider.getDistance(sphCords1)
}

var sphCords2 = new SphericalCoordinatesVector(3958.761, 51, 19);
var cartesianCords2 = SphCrtConverter.convertSphericalToCartesian(sphCords2);
var circle2 = {
    x: cartesianCords2.x,
    y: cartesianCords2.y,
    z: cartesianCords2.z,
    r: FakeDateProvider.getDistance(sphCords2)
}

var sphCords3 = new SphericalCoordinatesVector(3958.761, 51, 20);
var cartesianCords3 = SphCrtConverter.convertSphericalToCartesian(sphCords3);
var circle3 = {
    x: cartesianCords3.x,
    y: cartesianCords3.y,
    z: cartesianCords3.z,
    r: FakeDateProvider.getDistance(sphCords3)
}

var Trilateration = {
    trilaterateSphericalCords: function (p1Sph, p2Sph, p3Sph, return_middle) {
        var p1 = SphCrtConverter.convertSphericalToCartesian(p1Sph);
        var p2 = SphCrtConverter.convertSphericalToCartesian(p2Sph);
        var p3 = SphCrtConverter.convertSphericalToCartesian(p3Sph);

        // based on: https://en.wikipedia.org/wiki/Trilateration

        // some additional local functions declared here for
        // scalar and vector operations

        function sqr(a) {
            return a * a;
        }

        function norm(a) {
            return Math.sqrt(sqr(a.x) + sqr(a.y) + sqr(a.z));
        }

        function dot(a, b) {
            return a.x * b.x + a.y * b.y + a.z * b.z;
        }

        function vector_subtract(a, b) {
            return {
                x: a.x - b.x,
                y: a.y - b.y,
                z: a.z - b.z
            };
        }

        function vector_add(a, b) {
            return {
                x: a.x + b.x,
                y: a.y + b.y,
                z: a.z + b.z
            };
        }

        function vector_divide(a, b) {
            return {
                x: a.x / b,
                y: a.y / b,
                z: a.z / b
            };
        }

        function vector_multiply(a, b) {
            return {
                x: a.x * b,
                y: a.y * b,
                z: a.z * b
            };
        }

        function vector_cross(a, b) {
            return {
                x: a.y * b.z - a.z * b.y,
                y: a.z * b.x - a.x * b.z,
                z: a.x * b.y - a.y * b.x
            };
        }

        var ex, ey, ez, i, j, d, a, x, y, z, b, p4;

        ex = vector_divide(vector_subtract(p2, p1), norm(vector_subtract(p2, p1)));

        i = dot(ex, vector_subtract(p3, p1));
        a = vector_subtract(vector_subtract(p3, p1), vector_multiply(ex, i));
        ey = vector_divide(a, norm(a));
        ez = vector_cross(ex, ey);
        d = norm(vector_subtract(p2, p1));
        j = dot(ey, vector_subtract(p3, p1));

        x = (sqr(p1.r) - sqr(p2.r) + sqr(d)) / (2 * d);
        y = (sqr(p1.r) - sqr(p3.r) + sqr(i) + sqr(j)) / (2 * j) - (i / j) * x;

        b = sqr(p1.r) - sqr(x) - sqr(y);

        // floating point math flaw in IEEE 754 standard
        // see https://github.com/gheja/trilateration.js/issues/2
        if (Math.abs(b) < 0.0000000001) {
            b = 0;
        }

        z = Math.sqrt(b);

        // no solution found
        if (isNaN(z)) {
            return null;
        }

        a = vector_add(p1, vector_add(vector_multiply(ex, x), vector_multiply(ey, y)))
        p4a = vector_add(a, vector_multiply(ez, z));
        p4b = vector_subtract(a, vector_multiply(ez, z));

        if (z == 0 || return_middle) {
            return a;
        }
        else {
            return [p4a, p4b];
        }
    }
}