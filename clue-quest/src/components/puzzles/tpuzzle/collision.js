export default function addCollisionMethods(p) {
    p._collideDebug = false;

    p.collideDebug = function (debugMode) {
        p._collideDebug = debugMode;
    };

    p.collidePointCircle = function (x, y, cx, cy, d) {
        if (this.dist(x, y, cx, cy) <= d / 2) {
            return true;
        }
        return false;
    };

    p.collideLineLine = function (x1, y1, x2, y2, x3, y3, x4, y4, calcIntersection) {
        var intersection;

        // calculate the distance to intersection point
        var uA = ((x4 - x3) * (y1 - y3) - (y4 - y3) * (x1 - x3)) / ((y4 - y3) * (x2 - x1) - (x4 - x3) * (y2 - y1));
        var uB = ((x2 - x1) * (y1 - y3) - (y2 - y1) * (x1 - x3)) / ((y4 - y3) * (x2 - x1) - (x4 - x3) * (y2 - y1));

        // if uA and uB are between 0-1, lines are colliding
        if (uA >= 0 && uA <= 1 && uB >= 0 && uB <= 1) {
            if (this._collideDebug || calcIntersection) {
                // calc the point where the lines meet
                var intersectionX = x1 + (uA * (x2 - x1));
                var intersectionY = y1 + (uA * (y2 - y1));
            }

            if (this._collideDebug) {
                this.ellipse(intersectionX, intersectionY, 10, 10);
            }

            if (calcIntersection) {
                intersection = {
                    "x": intersectionX,
                    "y": intersectionY
                }
                return intersection;
            } else {
                return true;
            }
        }
        if (calcIntersection) {
            intersection = {
                "x": false,
                "y": false
            }
            return intersection;
        }
        return false;
    };

    p.collidePointPoly = function (px, py, vertices) {
        var collision = false;

        // go through each of the vertices, plus the next vertex in the list
        var next = 0;
        for (var current = 0; current < vertices.length; current++) {

            // get next vertex in list if we've hit the end, wrap around to 0
            next = current + 1;
            if (next === vertices.length) next = 0;

            // get the PVectors at our current position this makes our if statement a little cleaner
            var vc = vertices[current]; // c for "current"
            var vn = vertices[next]; // n for "next"

            // compare position, flip 'collision' variable back and forth
            if (((vc.y >= py && vn.y < py) || (vc.y < py && vn.y >= py)) &&
                (px < (vn.x - vc.x) * (py - vc.y) / (vn.y - vc.y) + vc.x)) {
                collision = !collision;
            }
        }
        return collision;
    };

    p.collideLinePoly = function (x1, y1, x2, y2, vertices) {
        // go through each of the vertices, plus the next vertex in the list
        var next = 0;
        for (var current = 0; current < vertices.length; current++) {

            // get next vertex in list if we've hit the end, wrap around to 0
            next = current + 1;
            if (next === vertices.length) next = 0;

            // get the PVectors at our current position extract X/Y coordinates from each
            var x3 = vertices[current].x;
            var y3 = vertices[current].y;
            var x4 = vertices[next].x;
            var y4 = vertices[next].y;

            // do a Line/Line comparison if true, return 'true' immediately and stop testing (faster)
            var hit = this.collideLineLine(x1, y1, x2, y2, x3, y3, x4, y4);
            if (hit) {
                return true;
            }
        }
        // never got a hit
        return false;
    };

    p.collidePolyPoly = function (p1, p2, interior) {
        if (interior === undefined) {
            interior = false;
        }

        // go through each of the vertices, plus the next vertex in the list
        var next = 0;
        for (var current = 0; current < p1.length; current++) {

            // get next vertex in list, if we've hit the end, wrap around to 0
            next = current + 1;
            if (next === p1.length) next = 0;

            // get the PVectors at our current position this makes our if statement a little cleaner
            var vc = p1[current]; // c for "current"
            var vn = p1[next]; // n for "next"

            //use these two points (a line) to compare to the other polygon's vertices using polyLine()
            var collision = this.collideLinePoly(vc.x, vc.y, vn.x, vn.y, p2);
            if (collision) return true;

            //check if the either polygon is INSIDE the other
            if (interior === true) {
                collision = this.collidePointPoly(p2[0].x, p2[0].y, p1);
                if (collision) return true;
                collision = this.collidePointPoly(p1[0].x, p1[0].y, p2);
                if (collision) return true;
            }
        }

        return false;
    };
}
