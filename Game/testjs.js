/**
 * @version 1.0.0.0
 * @copyright Copyright ©  2017
 * @compiler Bridge.NET 16.2.0
 */



Bridge.assembly("testjs", function ($asm, globals) {
    "use strict";

    Bridge.define("Test.Labyrinth", {
        fields: {
            dungeon: null,
            value: 0,
            roomPointsY: null,
            roomPointsX: null,
            roomOuterPointsY: null,
            roomOuterPointsX: null,
            choosePointX: null,
            choosePointY: null
        },
        props: {
            Dungeon: {
                get: function () {
                    return this.dungeon;
                },
                set: function (value) {
                    this.Dungeon = this.dungeon;
                }
            }
        },
        ctors: {
            init: function () {
                this.roomPointsY = new (System.Collections.Generic.List$1(System.Int32))();
                this.roomPointsX = new (System.Collections.Generic.List$1(System.Int32))();
                this.roomOuterPointsY = new (System.Collections.Generic.List$1(System.Int32))();
                this.roomOuterPointsX = new (System.Collections.Generic.List$1(System.Int32))();
                this.choosePointX = new (System.Collections.Generic.List$1(System.Int32))();
                this.choosePointY = new (System.Collections.Generic.List$1(System.Int32))();
            },
            ctor: function (Value, level) {
                if (Value === void 0) { Value = 40; }
                if (level === void 0) { level = 0; }

                this.$initialize();
                this.dungeon = System.Array.create(0, null, System.Char, Value, Value);
                this.value = Value;
                //Generiere Dungeon
                //TODO: Räume generieren
                for (var y = 0; y < this.value; y = (y + 1) | 0) {
                    for (var x = 0; x < this.value; x = (x + 1) | 0) {
                        if (y === 0 || y === ((this.value - 1) | 0)) {
                            this.dungeon.set([y, x], 111);
                        }
                        if (x === 0 || x === ((this.value - 1) | 0)) {
                            this.dungeon.set([y, x], 111);
                        } else {
                            if ((x % 2 === 0) || (y % 2 === 0)) {
                                this.dungeon.set([y, x], 111);
                            } else {
                                this.dungeon.set([y, x], 120);
                            }
                        }
                    }
                }
                this.GenerateRoomPoints();
                this.GenerateRoomFromPoints();
                this.GenerateMainWays();
                this.GenerateOtherWays();
                this.ConnectMainWaysToOtherWays();
                this.MakeLeftoverPointsToCrossings();
                this.RemoveUselessDeadends();
                this.MakeRoomConnectionComplete();
                this.SetSpawnAndDestinationPoint();
                this.ResetOuterWall();
            }
        },
        methods: {
            log: function () {
                var loginfo = "";
                loginfo = System.String.concat(loginfo, "Raumpunkte: \n");
                for (var c = 0; c < this.roomPointsX.Count; c = (c + 1) | 0) {
                    loginfo = System.String.concat(loginfo, (System.String.concat("Punkt: Y: ", this.roomPointsY.getItem(c).toString(), " X: ", this.roomPointsY.getItem(c).toString(), "\n")));
                }
                loginfo = System.String.concat(loginfo, "Äusere Raumpunkte: \n");
                for (var c1 = 0; c1 < this.roomOuterPointsX.Count; c1 = (c1 + 1) | 0) {
                    loginfo = System.String.concat(loginfo, (System.String.concat("OuterPunkt: Y: ", this.roomOuterPointsY.getItem(c1).toString(), " X: ", this.roomOuterPointsY.getItem(c1).toString(), "\n")));
                }
                loginfo = System.String.concat(loginfo, "\n Wirkliche Raumpunkte: \n");
                for (var c2 = 0; c2 < this.choosePointX.Count; c2 = (c2 + 1) | 0) {
                    loginfo = System.String.concat(loginfo, (System.String.concat("RealPunkt: Y: ", this.choosePointY.getItem(c2).toString(), " X: ", this.choosePointX.getItem(c2).toString(), "\n")));
                }
                return loginfo;
            },
            ResetOuterWall: function () {
                for (var y = 0; y < this.value; y = (y + 1) | 0) {
                    for (var x = 0; x < this.value; x = (x + 1) | 0) {
                        if (y === 0 || x === ((this.value - 1) | 0) || x === 0 || y === ((this.value - 1) | 0)) {
                            this.Dungeon.set([y, x], 111);
                        }
                    }
                }
            },
            GenerateRoomPoints: function () {
                var rnd = new System.Random.ctor();
                var myval = 6;
                var maybePoint = (((Bridge.Int.div(this.value, 2)) | 0) - 1) | 0;
                var count = 0;
                var setroom = false;
                var choosePoint = rnd.next$2(0, ((Bridge.Int.div(Bridge.Int.mul(this.value, this.value), myval)) | 0));
                for (var y = 0; y < this.value; y = (y + 1) | 0) {

                    for (var x = 0; x < this.value; x = (x + 1) | 0) {
                        count = (count + 1) | 0;
                        if (setroom === false) {
                            if (count === choosePoint) {
                                try {
                                    if (this.Dungeon.get([((y - 1) | 0), x]) === 120) {
                                        this.Dungeon.set([((y - 1) | 0), x], 119);
                                        this.roomPointsY.add(((y - 1) | 0));
                                        this.roomPointsX.add(x);
                                    }
                                    if (this.Dungeon.get([((y - 1) | 0), ((x - 1) | 0)]) === 120) {
                                        this.Dungeon.set([((y - 1) | 0), ((x - 1) | 0)], 119);
                                        this.roomPointsY.add(((y - 1) | 0));
                                        this.roomPointsX.add(((x - 1) | 0));
                                    }
                                    if (this.Dungeon.get([y, ((x - 1) | 0)]) === 120) {
                                        this.Dungeon.set([y, ((x - 1) | 0)], 119);
                                        this.roomPointsY.add(y);
                                        this.roomPointsX.add(((x - 1) | 0));
                                    }
                                    if (this.Dungeon.get([y, x]) === 120) {
                                        this.Dungeon.set([y, x], 119);
                                        this.roomPointsY.add(y);
                                        this.roomPointsX.add(x);
                                    }
                                    setroom = true;
                                }
                                catch ($e1) {
                                    $e1 = System.Exception.create($e1);
                                    choosePoint = (choosePoint + 1) | 0;
                                }
                            }

                        }
                        if (((Bridge.Int.div(Bridge.Int.mul(this.value, this.value), myval)) | 0) === count) {
                            choosePoint = rnd.next$2(0, ((Bridge.Int.div(Bridge.Int.mul(this.value, this.value), myval)) | 0));
                            count = 0;
                            setroom = false;
                        }

                    }
                }
            },
            checkRoundHouse: function (y, x, direction) {
                var $t, $t1;
                var copy = this.Dungeon;
                var possible = true;
                var count = 0;
                switch (($t = (($t1 = String.fromCharCode(direction).toUpperCase(), System.String.toCharArray($t1, 0, $t1.length))))[System.Array.index(0, $t)]) {
                    case 85:
                        while (possible === true) {
                            try {
                                if (copy.get([((y - count) | 0), x]) === x) {
                                    count = (count + 2) | 0;
                                } else {
                                    return count;
                                }
                            }
                            catch ($e1) {
                                $e1 = System.Exception.create($e1);
                                return count;
                            }
                        }
                        break;
                    case 68:
                        while (possible === true) {
                            try {
                                if (copy.get([((y + count) | 0), x]) === x) {
                                    count = (count + 2) | 0;
                                } else {
                                    return count;
                                }
                            }
                            catch ($e2) {
                                $e2 = System.Exception.create($e2);
                                return count;
                            }
                        }
                        break;
                    case 76:
                        while (possible === true) {
                            try {
                                if (copy.get([y, ((x - count) | 0)]) === x) {
                                    count = (count + 2) | 0;
                                } else {
                                    return count;
                                }
                            }
                            catch ($e3) {
                                $e3 = System.Exception.create($e3);
                                return count;
                            }
                        }
                        break;
                    case 82:
                        while (possible === true) {
                            try {
                                if (copy.get([y, ((x + count) | 0)]) === x) {
                                    count = (count + 2) | 0;
                                } else {
                                    return count;
                                }
                            }
                            catch ($e4) {
                                $e4 = System.Exception.create($e4);
                                return count;
                            }
                        }
                        break;
                    default:
                        break;
                }
                return 1;
            },
            expand: function (direction, walk1, walk2, posy, posx) {
                var $t, $t1;
                switch (($t = (($t1 = String.fromCharCode(direction).toUpperCase(), System.String.toCharArray($t1, 0, $t1.length))))[System.Array.index(0, $t)]) {
                    case 85:
                        this.roomOuterPointsX.add(0);
                        this.roomOuterPointsY.add(0);
                        for (var range = 0; range <= walk1; range = (range + 1) | 0) {
                            for (var range2 = 0; range2 <= walk2; range2 = (range2 + 1) | 0) {
                                this.Dungeon.set([((posy - range) | 0), ((posx + range2) | 0)], 119);
                            }
                            this.Dungeon.set([((posy - range) | 0), posx], 119);
                            this.roomOuterPointsX.setItem(((this.roomOuterPointsX.Count - 1) | 0), Bridge.Int.mul(posx, 2));
                            this.roomOuterPointsY.setItem(((this.roomOuterPointsY.Count - 1) | 0), Bridge.Int.mul((((posy - range) | 0)), 2));
                        }
                        break;
                    case 68:
                        this.roomOuterPointsX.add(0);
                        this.roomOuterPointsY.add(0);
                        for (var range1 = 0; range1 <= walk1; range1 = (range1 + 1) | 0) {
                            for (var range21 = 0; range21 <= walk2; range21 = (range21 + 1) | 0) {
                                this.Dungeon.set([((posy + range1) | 0), ((posx + range21) | 0)], 119);
                            }
                            this.Dungeon.set([((posy + range1) | 0), posx], 119);
                            this.roomOuterPointsX.setItem(((this.roomOuterPointsX.Count - 1) | 0), posx);
                            this.roomOuterPointsY.setItem(((this.roomOuterPointsY.Count - 1) | 0), (posy + range1) | 0);
                        }
                        break;
                    case 76:
                        this.roomOuterPointsX.add(0);
                        this.roomOuterPointsY.add(0);
                        for (var range2 = 0; range2 <= walk1; range2 = (range2 + 1) | 0) {
                            for (var range22 = 0; range22 <= walk2; range22 = (range22 + 1) | 0) {
                                this.Dungeon.set([((posy - range22) | 0), ((posx - range2) | 0)], 119);
                            }
                            this.Dungeon.set([posy, ((posx - range2) | 0)], 119);
                            this.roomOuterPointsX.setItem(((this.roomOuterPointsX.Count - 1) | 0), (posx - range2) | 0);
                            this.roomOuterPointsY.setItem(((this.roomOuterPointsY.Count - 1) | 0), posy);
                        }
                        break;
                    case 82:
                        this.roomOuterPointsX.add(0);
                        this.roomOuterPointsY.add(0);
                        for (var range3 = 0; range3 <= walk1; range3 = (range3 + 1) | 0) {
                            for (var range23 = 0; range23 <= walk2; range23 = (range23 + 1) | 0) {
                                this.Dungeon.set([((posy + range23) | 0), ((posx - range3) | 0)], 119);
                            }
                            this.Dungeon.set([posy, ((posx + range3) | 0)], 119);
                            this.roomOuterPointsX.setItem(((this.roomOuterPointsX.Count - 1) | 0), (posx + range3) | 0);
                            this.roomOuterPointsY.setItem(((this.roomOuterPointsY.Count - 1) | 0), posy);
                        }
                        break;
                    default:
                        break;
                }
            },
            GenerateRoomFromPoints: function () {


                var maxSize = 4;
                var minSize = 2;
                var onetime = false;

                for (var c = 0; c < this.roomPointsX.Count; c = (c + 1) | 0) {
                    {
                        var maxExpandUp = this.checkRoundHouse(this.roomPointsY.getItem(c), this.roomPointsX.getItem(c), 117);
                        var maxExpandDown = this.checkRoundHouse(this.roomPointsY.getItem(c), this.roomPointsX.getItem(c), 100);
                        var maxExpandLeft = this.checkRoundHouse(this.roomPointsY.getItem(c), this.roomPointsX.getItem(c), 108);
                        var maxExpandRight = this.checkRoundHouse(this.roomPointsY.getItem(c), this.roomPointsX.getItem(c), 114);

                        var chooseRoomSize = 0;

                        if (maxExpandUp >= maxSize) {
                            chooseRoomSize = (chooseRoomSize + maxSize) | 0;
                        } else {
                            if (maxExpandUp >= minSize && maxExpandUp < maxSize) {
                                chooseRoomSize = (chooseRoomSize + minSize) | 0;
                            }
                        }

                        if (maxExpandDown >= maxSize) {
                            chooseRoomSize = (chooseRoomSize + maxSize) | 0;
                        } else {
                            if (maxExpandDown >= minSize && maxExpandDown < maxSize) {
                                chooseRoomSize = (chooseRoomSize + minSize) | 0;
                            }
                        }

                        if (maxExpandLeft >= maxSize) {
                            chooseRoomSize = (chooseRoomSize + maxSize) | 0;
                        } else {
                            if (maxExpandLeft >= minSize && maxExpandLeft < maxSize) {
                                chooseRoomSize = (chooseRoomSize + minSize) | 0;
                            }
                        }

                        if (maxExpandRight >= maxSize) {
                            chooseRoomSize = (chooseRoomSize + maxSize) | 0;
                        } else {
                            if (maxExpandRight >= minSize && maxExpandRight < maxSize) {
                                chooseRoomSize = (chooseRoomSize + minSize) | 0;
                            }
                        }
                    }
                    if (onetime === false) {
                        try {
                            this.expand(100, 2, 2, this.roomPointsY.getItem(c), this.roomPointsX.getItem(c));
                        }
                        catch ($e1) {
                            $e1 = System.Exception.create($e1);
                            //none
                        }
                        try {
                            this.expand(108, 2, 2, this.roomPointsY.getItem(c), this.roomPointsX.getItem(c));
                        }
                        catch ($e2) {
                            $e2 = System.Exception.create($e2);

                        }
                        try {
                            this.expand(114, 2, 2, this.roomPointsY.getItem(c), this.roomPointsX.getItem(c));
                        }
                        catch ($e3) {
                            $e3 = System.Exception.create($e3);

                        }
                        try {
                            this.expand(117, 2, 2, this.roomPointsY.getItem(c), this.roomPointsX.getItem(c));
                        }
                        catch ($e4) {
                            $e4 = System.Exception.create($e4);

                        }
                        onetime = false;
                    }
                }
            },
            walkNext: function (y, x, direction, wayArt) {
                var $t, $t1;
                if (wayArt === void 0) { wayArt = 116; }
                switch (($t = (($t1 = String.fromCharCode(direction).toUpperCase(), System.String.toCharArray($t1, 0, $t1.length))))[System.Array.index(0, $t)]) {
                    case 85:
                        try {
                            if (this.Dungeon.get([((y - 2) | 0), x]) === 120) {
                                for (var i = 0; i < 3; i = (i + 1) | 0) {
                                    this.Dungeon.set([((y - i) | 0), x], wayArt);
                                }
                                return true;
                            } else {
                                return false;
                            }
                        }
                        catch ($e1) {
                            $e1 = System.Exception.create($e1);
                            return false;
                        }
                    case 68:
                        try {
                            if (this.Dungeon.get([((y + 2) | 0), x]) === 120) {
                                for (var i1 = 0; i1 < 3; i1 = (i1 + 1) | 0) {
                                    this.Dungeon.set([((y + i1) | 0), x], wayArt);
                                }
                                return true;
                            } else {
                                return false;
                            }
                        }
                        catch ($e2) {
                            $e2 = System.Exception.create($e2);
                            return false;
                        }
                    case 76:
                        try {
                            if (this.Dungeon.get([y, ((x - 2) | 0)]) === 120) {
                                for (var i2 = 0; i2 < 3; i2 = (i2 + 1) | 0) {
                                    this.Dungeon.set([y, ((x - i2) | 0)], wayArt);
                                }
                                return true;
                            } else {
                                return false;
                            }
                        }
                        catch ($e3) {
                            $e3 = System.Exception.create($e3);
                            return false;
                        }
                    case 82:
                        try {
                            if (this.Dungeon.get([y, ((x + 2) | 0)]) === 120) {
                                for (var i3 = 0; i3 < 3; i3 = (i3 + 1) | 0) {
                                    this.Dungeon.set([y, ((x + i3) | 0)], wayArt);
                                }
                                return true;
                            } else {
                                return false;
                            }
                        }
                        catch ($e4) {
                            $e4 = System.Exception.create($e4);
                            return false;
                        }
                    default:
                        return false;
                }
            },
            walkOne: function (y, x, directory) {
                var $t, $t1;
                try {
                    switch (($t = (($t1 = String.fromCharCode(directory).toUpperCase(), System.String.toCharArray($t1, 0, $t1.length))))[System.Array.index(0, $t)]) {
                        case 85:
                            this.Dungeon.set([((y - 1) | 0), x], 99);
                            return true;
                        case 68:
                            this.Dungeon.set([((y + 1) | 0), x], 99);
                            return true;
                        case 76:
                            this.Dungeon.set([y, ((x - 1) | 0)], 99);
                            return true;
                        case 82:
                            this.Dungeon.set([y, ((x + 1) | 0)], 99);
                            return true;
                        default:
                            return false;
                    }
                }
                catch ($e1) {
                    $e1 = System.Exception.create($e1);
                    return false;
                }
            },
            checkNext: function (y, x, direction) {
                var $t, $t1;
                switch (($t = (($t1 = String.fromCharCode(direction).toUpperCase(), System.String.toCharArray($t1, 0, $t1.length))))[System.Array.index(0, $t)]) {
                    case 85:
                        try {
                            if (this.Dungeon.get([((y - 2) | 0), x]) === 120) {
                                return true;
                            } else {
                                return false;
                            }
                        }
                        catch ($e1) {
                            $e1 = System.Exception.create($e1);
                            return false;
                        }
                    case 68:
                        try {
                            if (this.Dungeon.get([((y + 2) | 0), x]) === 120) {
                                return true;
                            } else {
                                return false;
                            }
                        }
                        catch ($e2) {
                            $e2 = System.Exception.create($e2);
                            return false;
                        }
                    case 76:
                        try {
                            if (this.Dungeon.get([y, ((x - 2) | 0)]) === 120) {
                                return true;
                            } else {
                                return false;
                            }
                        }
                        catch ($e3) {
                            $e3 = System.Exception.create($e3);
                            return false;
                        }
                    case 82:
                        try {
                            if (this.Dungeon.get([y, ((x + 2) | 0)]) === 120) {
                                return true;
                            } else {
                                return false;
                            }
                        }
                        catch ($e4) {
                            $e4 = System.Exception.create($e4);
                            return false;
                        }
                    default:
                        return false;
                }
            },
            checkSide: function (y, x, direction) {
                var $t, $t1;
                try {
                    switch (($t = (($t1 = String.fromCharCode(direction).toUpperCase(), System.String.toCharArray($t1, 0, $t1.length))))[System.Array.index(0, $t)]) {
                        case 85:
                            if (this.Dungeon.get([((y + 1) | 0), x]) === 111) {
                                return true;
                            } else {
                                return false;
                            }
                        case 68:
                            if (this.Dungeon.get([((y - 1) | 0), x]) === 111) {
                                return true;
                            } else {
                                return false;
                            }
                        case 76:
                            if (this.Dungeon.get([y, ((x - 1) | 0)]) === 111) {
                                return true;
                            } else {
                                return false;
                            }
                        case 82:
                            if (this.Dungeon.get([y, ((x + 1) | 0)]) === 111) {
                                return true;
                            } else {
                                return false;
                            }
                        default:
                            return false;
                    }
                }
                catch ($e1) {
                    $e1 = System.Exception.create($e1);
                    return false;
                }

            },
            modelCheck: function (y, x, directory) {
                var $t, $t1;
                var countVar = 0;
                //TODO: prüfe ob setblock schon ein Weg ist !!
                try {
                    switch (($t = (($t1 = String.fromCharCode(directory).toUpperCase(), System.String.toCharArray($t1, 0, $t1.length))))[System.Array.index(0, $t)]) {
                        case 85:
                            y = (y - 2) | 0;
                            x = (x - 1) | 0;
                            break;
                        case 68:
                            x = (x - 1) | 0;
                            break;
                        case 76:
                            y = (y - 1) | 0;
                            break;
                        case 82:
                            y = (y - 1) | 0;
                            x = (x - 2) | 0;
                            break;
                        default:
                            break;
                    }
                    for (var y1 = 0; y1 < 3; y1 = (y1 + 1) | 0) {
                        for (var x1 = 0; x1 < 3; x1 = (x1 + 1) | 0) {
                            if (this.Dungeon.get([((y + y1) | 0), ((x + x1) | 0)]) === 111) {
                                countVar = (countVar + 1) | 0;
                            }
                        }
                    }
                }
                catch ($e1) {
                    $e1 = System.Exception.create($e1);

                }

                if (countVar >= 5) {
                    return true;
                } else {
                    return false;
                }
            },
            GenerateMainWays: function () {
                var walkPointsY = new (System.Collections.Generic.List$1(System.Int32))();
                var walkPointsX = new (System.Collections.Generic.List$1(System.Int32))();
                for (var i = 0; i < this.roomOuterPointsX.Count; i = (i + 1) | 0) {
                    try {
                        if (this.Dungeon.get([this.roomOuterPointsY.getItem(i), this.roomOuterPointsX.getItem(i)]) === 119) {
                            this.choosePointY.add(this.roomOuterPointsY.getItem(i));
                            this.choosePointX.add(this.roomOuterPointsX.getItem(i));
                        }
                    }
                    catch ($e1) {
                        $e1 = System.Exception.create($e1);
                        //none
                    }
                }



                for (var i1 = 0; i1 < this.choosePointX.Count; i1 = (i1 + 1) | 0) {
                    //UP
                    if (this.checkNext(this.choosePointY.getItem(i1), this.choosePointX.getItem(i1), 117) === true) {
                        walkPointsY.add(((this.choosePointY.getItem(i1) - 2) | 0));
                        walkPointsX.add(this.choosePointX.getItem(i1));
                    }
                    //DOWN
                    if (this.checkNext(this.choosePointY.getItem(i1), this.choosePointX.getItem(i1), 100) === true) {
                        walkPointsY.add(((this.choosePointY.getItem(i1) + 2) | 0));
                        walkPointsX.add(this.choosePointX.getItem(i1));
                    }
                    //LEFT
                    if (this.checkNext(this.choosePointY.getItem(i1), this.choosePointX.getItem(i1), 108) === true) {
                        walkPointsY.add(this.choosePointY.getItem(i1));
                        walkPointsX.add(((this.choosePointX.getItem(i1) - 2) | 0));
                    }
                    //RIGHT
                    if (this.checkNext(this.choosePointY.getItem(i1), this.choosePointX.getItem(i1), 114) === true) {
                        walkPointsY.add(this.choosePointY.getItem(i1));
                        walkPointsX.add(((this.choosePointX.getItem(i1) + 2) | 0));
                    }
                }
                if (walkPointsX.Count === 0) {
                    //LevelNeuGenerieren
                }


                var rnd = new System.Random.ctor();
                for (var i2 = 0; i2 < walkPointsX.Count; i2 = (i2 + 1) | 0) {
                    //WalkDown
                    var y = 0;
                    var x = 0;
                    if (this.checkNext(walkPointsY.getItem(i2), walkPointsX.getItem(i2), 117)) {
                        this.walkNext(walkPointsY.getItem(i2), walkPointsX.getItem(i2), 117);
                        y = (walkPointsY.getItem(i2) - 2) | 0;
                        x = walkPointsX.getItem(i2);
                    } else if (this.checkNext(walkPointsY.getItem(i2), walkPointsX.getItem(i2), 100)) {
                        this.walkNext(walkPointsY.getItem(i2), walkPointsX.getItem(i2), 100);
                        y = (walkPointsY.getItem(i2) + 2) | 0;
                        x = walkPointsX.getItem(i2);
                    } else if (this.checkNext(walkPointsY.getItem(i2), walkPointsX.getItem(i2), 108)) {
                        this.walkNext(walkPointsY.getItem(i2), walkPointsX.getItem(i2), 108);
                        y = walkPointsY.getItem(i2);
                        x = (walkPointsX.getItem(i2) - 2) | 0;
                    } else if (this.checkNext(walkPointsY.getItem(i2), walkPointsX.getItem(i2), 114)) {
                        this.walkNext(walkPointsY.getItem(i2), walkPointsX.getItem(i2), 114);
                        y = walkPointsY.getItem(i2);
                        x = (walkPointsX.getItem(i2) + 2) | 0;
                    } else {
                        continue;
                    }

                    var counter = 0;

                    var chooseFromThis = new (System.Collections.Generic.List$1(System.Int32))();
                    chooseFromThis = new (System.Collections.Generic.List$1(System.Int32))();
                    chooseFromThis.add(1);
                    chooseFromThis.add(2);
                    chooseFromThis.add(3);
                    chooseFromThis.add(4);

                    while (this.checkNext(y, x, 117) === true || this.checkNext(y, x, 100) === true || this.checkNext(y, x, 108) === true || this.checkNext(y, x, 114) === true) {
                        if (counter >= 500) {
                            break;
                        }
                        var dir = rnd.next$2(0, ((chooseFromThis.Count - 1) | 0));

                        switch (chooseFromThis.getItem(dir)) {
                            case 1:
                                if (this.checkNext(y, x, 117)) {
                                    this.walkNext(y, x, 117);
                                    y = (y - 2) | 0;
                                    chooseFromThis = new (System.Collections.Generic.List$1(System.Int32))();
                                    chooseFromThis.add(2);
                                    chooseFromThis.add(3);
                                    chooseFromThis.add(4);
                                }
                                break;
                            case 2:
                                if (this.checkNext(y, x, 100)) {
                                    this.walkNext(y, x, 100);
                                    y = (y + 2) | 0;
                                    chooseFromThis = new (System.Collections.Generic.List$1(System.Int32))();
                                    chooseFromThis.add(1);
                                    chooseFromThis.add(3);
                                    chooseFromThis.add(4);
                                }
                                break;
                            case 3:
                                if (this.checkNext(y, x, 108)) {
                                    this.walkNext(y, x, 108);
                                    x = (x - 2) | 0;
                                    chooseFromThis = new (System.Collections.Generic.List$1(System.Int32))();
                                    chooseFromThis.add(1);
                                    chooseFromThis.add(2);
                                    chooseFromThis.add(4);
                                }
                                break;
                            case 4:
                                if (this.checkNext(y, x, 114)) {
                                    this.walkNext(y, x, 114);
                                    x = (x + 2) | 0;
                                    chooseFromThis = new (System.Collections.Generic.List$1(System.Int32))();
                                    chooseFromThis.add(1);
                                    chooseFromThis.add(2);
                                    chooseFromThis.add(3);
                                }
                                break;
                            default:
                                break;
                        }
                        counter = (counter + 1) | 0;

                    }
                }
                //Generiere Wege von den Mitten der Räumen
            },
            GenerateOtherWays: function () {

                for (var y = 0; y < this.value; y = (y + 1) | 0) {
                    for (var x = 0; x < this.value; x = (x + 1) | 0) {
                        if (this.Dungeon.get([y, x]) === 120) {
                            var y2 = y;
                            var x2 = x;
                            while (this.checkNext(y2, x2, 117) || this.checkNext(y2, x2, 100) || this.checkNext(y2, x2, 108) || this.checkNext(y2, x2, 114)) {
                                if (this.checkNext(y2, x2, 117)) {
                                    this.walkNext(y2, x2, 117, 117);
                                    y2 = (y2 - 2) | 0;
                                }
                                if (this.checkNext(y2, x2, 100)) {
                                    this.walkNext(y2, x2, 100, 117);
                                    y2 = (y2 + 2) | 0;
                                }
                                if (this.checkNext(y2, x2, 108)) {
                                    this.walkNext(y2, x2, 108, 117);
                                    x2 = (x2 - 2) | 0;
                                }
                                if (this.checkNext(y2, x2, 114)) {
                                    this.walkNext(y2, x2, 114, 117);
                                    x2 = (x2 + 2) | 0;
                                }
                            }
                        }
                    }
                }
            },
            ConnectMainWaysToOtherWays: function () {

                for (var y = 0; y < this.value; y = (y + 1) | 0) {
                    for (var x = 0; x < this.value; x = (x + 1) | 0) {
                        if (this.Dungeon.get([y, x]) === 116) {
                            if (this.modelCheck(y, x, 117)) {
                                this.walkOne(y, x, 117);
                            }
                            if (this.modelCheck(y, x, 100)) {
                                this.walkOne(y, x, 100);
                            }
                            if (this.modelCheck(y, x, 108)) {
                                this.walkOne(y, x, 108);
                            }
                            if (this.modelCheck(y, x, 114)) {
                                this.walkOne(y, x, 114);
                            }
                        }
                    }
                }
            },
            MakeLeftoverPointsToCrossings: function () {

                for (var y = 0; y < this.value; y = (y + 1) | 0) {
                    for (var x = 0; x < this.value; x = (x + 1) | 0) {
                        if (this.Dungeon.get([y, x]) === 120) {
                            var count = 0;
                            var y2 = (y - 1) | 0;
                            var x2 = (x - 1) | 0;

                            for (var i = 0; i < 3; i = (i + 1) | 0) {
                                for (var a = 0; a < 3; a = (a + 1) | 0) {
                                    try {
                                        if (this.Dungeon.get([((y2 + i) | 0), ((x2 + a) | 0)]) !== 111) {
                                            count = (count + 1) | 0;
                                        }
                                    }
                                    catch ($e1) {
                                        $e1 = System.Exception.create($e1);

                                    }

                                }
                            }

                            if (count >= 2) {
                                this.Dungeon.set([y, x], 118);
                            } else {
                                this.Dungeon.set([y, x], 118);

                                this.Dungeon.set([((y - 1) | 0), x], 118);
                                this.Dungeon.set([((y + 1) | 0), x], 118);
                                this.Dungeon.set([y, ((x - 1) | 0)], 118);
                                this.Dungeon.set([y, ((x + 1) | 0)], 118);
                            }

                        }
                    }
                }
            },
            RemoveUselessDeadends: function () {

                for (var y = 0; y < this.value; y = (y + 1) | 0) {
                    for (var x = 0; x < this.value; x = (x + 1) | 0) {
                        if (this.Dungeon.get([y, x]) !== 111) {
                            var y2 = (y - 1) | 0;
                            var x2 = (x - 1) | 0;
                            var count = 0;

                            for (var i = 0; i < 3; i = (i + 1) | 0) {
                                for (var a = 0; a < 3; a = (a + 1) | 0) {
                                    try {
                                        if (this.Dungeon.get([((y2 + i) | 0), ((x2 + a) | 0)]) !== 111) {
                                            count = (count + 1) | 0;
                                        }
                                    }
                                    catch ($e1) {
                                        $e1 = System.Exception.create($e1);

                                    }
                                }
                            }

                            if (count <= 2) {
                                try {
                                    if (this.Dungeon.get([((y - 1) | 0), x]) !== 111) { //UP
                                        this.Dungeon.set([((y + 1) | 0), x], 99);
                                    } else if (this.Dungeon.get([((y + 1) | 0), x]) !== 111) { //DOWN
                                        this.Dungeon.set([((y - 1) | 0), x], 99);
                                    } else if (this.Dungeon.get([y, ((x - 1) | 0)]) !== 111) { //LEFT
                                        this.Dungeon.set([y, ((x + 1) | 0)], 99);
                                    } else if (this.Dungeon.get([y, ((x + 1) | 0)]) !== 111) { //RIGHT
                                        this.Dungeon.set([y, ((x - 1) | 0)], 99);
                                    }
                                }
                                catch ($e2) {
                                    $e2 = System.Exception.create($e2);

                                }
                            }
                        }
                    }
                }
            },
            MakeRoomConnectionComplete: function () {



                for (var i = 0; i < this.choosePointX.Count; i = (i + 1) | 0) {
                    if (this.checkSide(this.choosePointY.getItem(i), this.choosePointX.getItem(i), 117)) {
                        try {
                            this.Dungeon.set([((this.choosePointY.getItem(i) + 1) | 0), this.choosePointX.getItem(i)], 99);
                        }
                        catch ($e1) {
                            $e1 = System.Exception.create($e1);

                        }
                    }
                    if (this.checkSide(this.choosePointY.getItem(i), this.choosePointX.getItem(i), 100)) {
                        try {
                            this.Dungeon.set([((this.choosePointY.getItem(i) - 1) | 0), this.choosePointX.getItem(i)], 99);
                        }
                        catch ($e2) {
                            $e2 = System.Exception.create($e2);

                        }
                    }
                    if (this.checkSide(this.choosePointY.getItem(i), this.choosePointX.getItem(i), 108)) {
                        try {
                            this.Dungeon.set([this.choosePointY.getItem(i), ((this.choosePointX.getItem(i) - 1) | 0)], 99);
                        }
                        catch ($e3) {
                            $e3 = System.Exception.create($e3);

                        }
                    }
                    if (this.checkSide(this.choosePointY.getItem(i), this.choosePointX.getItem(i), 114)) {
                        try {
                            this.Dungeon.set([this.choosePointY.getItem(i), ((this.choosePointX.getItem(i) + 1) | 0)], 99);
                        }
                        catch ($e4) {
                            $e4 = System.Exception.create($e4);

                        }
                    }
                }
            },
            SetSpawnAndDestinationPoint: function () {
                try {
                    //Spawn
                    this.Dungeon.set([this.roomPointsY.getItem(0), this.roomPointsX.getItem(0)], 115);
                    //Destination
                    this.Dungeon.set([this.roomPointsY.getItem(((this.roomPointsY.Count - 1) | 0)), this.roomPointsX.getItem(((this.roomPointsX.Count - 1) | 0))], 101);
                }
                catch ($e1) {
                    $e1 = System.Exception.create($e1);

                }
            }
        }
    });

    Bridge.define("Test.Program", {
        main: function Main (args) {
          var canvas = document.querySelector("#renderCanvas");
          var engine = new BABYLON.Engine(canvas, true);
          var createScene = function () {

            var multiplyer = 4;
            var sizeRaw = size;
            var sizeGround = sizeRaw*multiplyer;

              var scene = new BABYLON.Scene(engine);
              scene.clearColor = new BABYLON.Color3(0.5, 0.8, 0.5);
              scene.ambientColor = new BABYLON.Color3(0.3, 0.3, 0.3);
              // Lights
              var light0 = new BABYLON.HemisphericLight("light1", new BABYLON.Vector3(0, 1, 0), scene);


              // Need free cam for collisions
              var camera = new BABYLON.FreeCamera("FreeCamera", new BABYLON.Vector3(sizeGround/2, 1, sizeGround/2), scene);
              camera.attachControl(canvas, true);

              //Skybox
              var boxCloud = BABYLON.Mesh.CreateSphere("boxCloud", 100, 1000, scene);
              boxCloud.position = new BABYLON.Vector3(0, 0, 12);
              var cloudMaterial = new BABYLON.StandardMaterial("cloudMat", scene);
              var cloudProcText = new BABYLON.CloudProceduralTexture("cloud", 1024, scene);
              cloudMaterial.emissiveTexture = cloudProcText;
              cloudMaterial.backFaceCulling = false;
              cloudMaterial.emissiveTexture.coordinatesMode = BABYLON.Texture.SKYBOX_MODE;
              boxCloud.material = cloudMaterial;

              var ground = BABYLON.Mesh.CreatePlane("ground", sizeGround, scene);
              var roadmaterial = new BABYLON.StandardMaterial("road", scene);
              var roadmaterialpt = new BABYLON.RoadProceduralTexture("customtext", 5012, scene);
              roadmaterial.diffuseTexture = roadmaterialpt;
              ground.material = new BABYLON.StandardMaterial("groundMat", scene);
              ground.material.diffuseColor = new BABYLON.Color3(1, 1, 1);
              ground.material.backFaceCulling = false;
              ground.material = roadmaterial;
              ground.position = new BABYLON.Vector3(5, -10, -15);
              ground.rotation = new BABYLON.Vector3(Math.PI / 2, 0, 0);
              ground.setAbsolutePosition(sizeGround/2, 0, sizeGround/2);
              //positions
              


              var box1 = BABYLON.Mesh.CreateBox("crate", 4, scene);
              box1.position = new BABYLON.Vector3(0, -9, 0);
              box1.setAbsolutePosition(sizeGround/2, 1, sizeGround/2);
              box1.position.x = 2;
              box1.position.z = 2;

              var box1 = BABYLON.Mesh.CreateBox("crate", 4, scene);
              var material = new BABYLON.StandardMaterial("material", scene);
              var texture = new BABYLON.WoodProceduralTexture("texture", 1024, scene);
              material.diffuseTexture = texture;
              box1.material = material;

              box1.position = new BABYLON.Vector3(0, -9, 0);
              box1.setAbsolutePosition(sizeGround/2, 1, sizeGround/2);


              box1.material = roadmaterial;
              box1.position.x = 6;
              box1.position.z = 2;

              // Enable Collisions
              scene.collisionsEnabled = true;

              camera.checkCollisions = true;
              camera.applyGravity = true;


              camera.ellipsoid = new BABYLON.Vector3(1, 1, 1);
              camera.speed = 0.5;
              camera.parent = light0;

              ground.checkCollisions = true;
              box1.checkCollisions = true;

              //createLabyrinth
              var createBox = new Array();
              var zVektor = 2;
              var xVektor = 2;
              console.log(dungeonArray);
              console.log(teststring);

              var mylab = new Test.Labyrinth(35);
              var brickMaterial = new BABYLON.StandardMaterial(name, scene);
              var brickTexture = new BABYLON.BrickProceduralTexture(name + "text", 512, scene);
              brickTexture.numberOfBricksHeight = 6;
              brickTexture.numberOfBricksWidth = 10;
              brickMaterial.diffuseTexture = brickTexture;

              var zEnd = 0;
              var xEnd = 0;

              for (var y = 0; y < 35; y = (y + 1) | 0) {
                  for (var x = 0; x < 35; x = (x + 1) | 0) {
                    if(String.fromCharCode(mylab.Dungeon.get([y, x])) == "o"){
                      createBox[i] = BABYLON.Mesh.CreateBox("crate", 4, scene);
                      createBox[i].position = new BABYLON.Vector3(0, -9, 0);
                      createBox[i].setAbsolutePosition(sizeGround/2, 1, sizeGround/2);
                      createBox[i].position.x = xVektor;
                      createBox[i].position.z = zVektor;
                      createBox[i].checkCollisions = true;
                      createBox[i].material = brickMaterial;
                    }
                    if(String.fromCharCode(mylab.Dungeon.get([y, x])) == "s"){
                      var sphere = BABYLON.Mesh.CreateSphere("sphere1", 16, 2, scene);
                      sphere.material = new BABYLON.StandardMaterial("blue", scene);
                      sphere.material.diffuseColor = new BABYLON.Color3(0, 0, 0);
                      sphere.material.specularColor = new BABYLON.Color3(0, 0, 0);
                      sphere.material.emissiveColor = new BABYLON.Color3(0, 0, 1);
                      sphere.position.y = 13;
                      sphere.position.x = xVektor;
                      sphere.position.z = zVektor;
                      camera.position.x = xVektor;
                      camera.position.z = zVektor;
                    }
                    if(String.fromCharCode(mylab.Dungeon.get([y, x])) == "e"){
                      var sphere2 = BABYLON.Mesh.CreateSphere("sphere2", 16, 2, scene);
                      sphere2.material = new BABYLON.StandardMaterial("green", scene);
                      sphere2.material.diffuseColor = new BABYLON.Color3(0, 0, 0);
                      sphere2.material.specularColor = new BABYLON.Color3(0, 0, 0);
                      sphere2.material.emissiveColor = new BABYLON.Color3(0, 1, 0);
                      sphere2.position.y = 2;
                      sphere2.position.x = xVektor;
                      sphere2.position.z = zVektor;

                      zEnd = zVektor;
                      xEnd = xVektor;
                    }
                    xVektor = xVektor + 4;
                  }
                  zVektor = zVektor + 4;
                  xVektor = 2;
              }

              //visulize to table
              var output = "";
              output += "<table style\"width:70px; height: 70px; table-layout:fixed;\">";
              for(var y = 0; y < 35; y = (y + 1) | 0){
                output += "<tr>";
                for(var x = 0; x < 35; x = (x + 1) | 0){
                  output += "<td class=\"" + String.fromCharCode(mylab.Dungeon.get([y, x]))  +" wh\"></td>";

                }
                output += "</tr>";
              }
              output += "</table>";
              document.getElementById('minimap').innerHTML = output;
              console.log(xEnd);
              console.log(zEnd);


              setInterval(function(){
                console.log(Math.round(camera.position.x));
                console.log(Math.round(camera.position.z));

                if(Math.round(camera.position.x) == xEnd && Math.round(camera.position.z) == zEnd){
                  document.getElementById('finished').style.display = "block";
                }
              }, 400);
              //Cheats bzw Development tools :P

              return scene;
          }

          var scene = createScene();

          engine.runRenderLoop(function () {
             scene.render();
          });

          window.addEventListener("resize", function () {
             engine.resize();
          });


        }
    });
});

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICJ0ZXN0anMuanMiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbIkFwcC5jcyJdLAogICJuYW1lcyI6IFsiIl0sCiAgIm1hcHBpbmdzIjogIjs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztvQkFlZ0JBLE9BQU9BOzs7b0JBR1BBLGVBQVVBOzs7Ozs7bUNBTWNBLEtBQUlBO21DQUNKQSxLQUFJQTt3Q0FFQ0EsS0FBSUE7d0NBQ0pBLEtBQUlBO29DQUVSQSxLQUFJQTtvQ0FDSkEsS0FBSUE7OzRCQUVwQkEsT0FBZ0JBOzs7OztnQkFDN0JBLGVBQVVBLDBDQUFTQSxPQUFPQTtnQkFDMUJBLGFBQVFBOzs7Z0JBR1JBLEtBQUtBLFdBQVdBLElBQUlBLFlBQU9BO29CQUN2QkEsS0FBS0EsV0FBV0EsSUFBSUEsWUFBT0E7d0JBQ3ZCQSxJQUFJQSxXQUFVQSxNQUFLQTs0QkFDZkEsa0JBQVFBLEdBQUdBOzt3QkFFZkEsSUFBSUEsV0FBVUEsTUFBS0E7NEJBQ2ZBLGtCQUFRQSxHQUFHQTs7NEJBR1hBLElBQUlBLENBQUNBLGdCQUFlQSxDQUFDQTtnQ0FDakJBLGtCQUFRQSxHQUFHQTs7Z0NBR1hBLGtCQUFRQSxHQUFHQTs7Ozs7Z0JBSzNCQTtnQkFDQUE7Z0JBQ0FBO2dCQUNBQTtnQkFDQUE7Z0JBQ0FBO2dCQUNBQTtnQkFDQUE7Z0JBQ0FBO2dCQUNBQTs7Ozs7Z0JBR0FBO2dCQUNBQTtnQkFDQUEsS0FBS0EsV0FBV0EsSUFBSUEsd0JBQW1CQTtvQkFDbkNBLHdDQUFXQSxvQ0FBb0JBLHlCQUFZQSx1QkFBeUJBLHlCQUFZQTs7Z0JBRXBGQTtnQkFDQUEsS0FBS0EsWUFBV0EsS0FBSUEsNkJBQXdCQTtvQkFDeENBLHdDQUFXQSx5Q0FBeUJBLDhCQUFpQkEsd0JBQXlCQSw4QkFBaUJBOztnQkFFbkdBO2dCQUNBQSxLQUFLQSxZQUFXQSxLQUFJQSx5QkFBb0JBO29CQUNwQ0Esd0NBQVdBLHdDQUF3QkEsMEJBQWFBLHdCQUF5QkEsMEJBQWFBOztnQkFFMUZB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VkEsSUFBSUEsa0JBQVFBLEdBQUdBO3dDQUNoQkEsa0JBQVFBLEdBQUdBOzs7Ozs7Ozs7Ozs7Ozs7O2dCQWVuQ0EsS0FBS0EsV0FBV0EsSUFBSUEseUJBQW9CQTtvQkFDcENBLElBQUlBLGVBQVVBLDBCQUFhQSxJQUFJQSwwQkFBYUE7d0JBQ3hDQTs0QkFDSUEsa0JBQVFBLDRCQUFhQSxjQUFRQSwwQkFBYUE7Ozs7Ozs7b0JBTWxEQSxJQUFJQSxlQUFVQSwwQkFBYUEsSUFBSUEsMEJBQWFBO3dCQUN4Q0E7NEJBQ0lBLGtCQUFRQSw0QkFBYUEsY0FBUUEsMEJBQWFBOzs7Ozs7O29CQU1sREEsSUFBSUEsZUFBVUEsMEJBQWFBLElBQUlBLDBCQUFhQTt3QkFDeENBOzRCQUNJQSxrQkFBUUEsMEJBQWFBLElBQUlBLDRCQUFhQTs7Ozs7OztvQkFNOUNBLElBQUlBLGVBQVVBLDBCQUFhQSxJQUFJQSwwQkFBYUE7d0JBQ3hDQTs0QkFDSUEsa0JBQVFBLDBCQUFhQSxJQUFJQSw0QkFBYUE7Ozs7Ozs7Ozs7Z0JBU2xEQTs7b0JBRUlBLGtCQUFRQSw2QkFBZ0JBOztvQkFFeEJBLGtCQUFRQSx5QkFBWUEscUNBQXdCQSx5QkFBWUE7Ozs7Ozs7Ozs7OzZCQVMvQ0E7O1lBRWJBLFlBQWtCQSxJQUFJQTs7WUFFdEJBLEtBQUtBLFdBQVdBLFFBQVFBO2dCQUNwQkEsS0FBS0EsV0FBV0EsUUFBUUE7b0JBQ3BCQSx5Q0FBY0EsbUJBQWNBLEdBQUdBOztnQkFFbkNBIiwKICAic291cmNlc0NvbnRlbnQiOiBbInVzaW5nIEJyaWRnZTtcclxudXNpbmcgQnJpZGdlLkh0bWw1O1xyXG51c2luZyBOZXd0b25zb2Z0Lkpzb247XHJcbnVzaW5nIFN5c3RlbTtcclxudXNpbmcgU3lzdGVtO1xyXG51c2luZyBTeXN0ZW0uQ29sbGVjdGlvbnMuR2VuZXJpYztcclxudXNpbmcgU3lzdGVtLkxpbnE7XHJcbnVzaW5nIFN5c3RlbS5UZXh0O1xyXG51c2luZyBTeXN0ZW0uVGhyZWFkaW5nLlRhc2tzO1xyXG5cclxubmFtZXNwYWNlIFRlc3Qge1xyXG5cclxuICAgIHB1YmxpYyBjbGFzcyBMYWJ5cmludGgge1xyXG4gICAgICAgIHB1YmxpYyBjaGFyWyxdIER1bmdlb24ge1xyXG4gICAgICAgICAgICBnZXQge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIGR1bmdlb247XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgc2V0IHtcclxuICAgICAgICAgICAgICAgIER1bmdlb24gPSBkdW5nZW9uO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHByaXZhdGUgY2hhclssXSBkdW5nZW9uO1xyXG4gICAgICAgIHByaXZhdGUgaW50IHZhbHVlO1xyXG5cclxuICAgICAgICBwcml2YXRlIExpc3Q8aW50PiByb29tUG9pbnRzWSA9IG5ldyBMaXN0PGludD4oKTtcclxuICAgICAgICBwcml2YXRlIExpc3Q8aW50PiByb29tUG9pbnRzWCA9IG5ldyBMaXN0PGludD4oKTtcclxuXHJcbiAgICAgICAgcHJpdmF0ZSBMaXN0PGludD4gcm9vbU91dGVyUG9pbnRzWSA9IG5ldyBMaXN0PGludD4oKTtcclxuICAgICAgICBwcml2YXRlIExpc3Q8aW50PiByb29tT3V0ZXJQb2ludHNYID0gbmV3IExpc3Q8aW50PigpO1xyXG5cclxuICAgICAgICBwcml2YXRlIExpc3Q8aW50PiBjaG9vc2VQb2ludFggPSBuZXcgTGlzdDxpbnQ+KCk7XHJcbiAgICAgICAgcHJpdmF0ZSBMaXN0PGludD4gY2hvb3NlUG9pbnRZID0gbmV3IExpc3Q8aW50PigpO1xyXG5cclxuICAgICAgICBwdWJsaWMgTGFieXJpbnRoKGludCBWYWx1ZSA9IDQwLCBpbnQgbGV2ZWwgPSAwKSB7XHJcbiAgICAgICAgICAgIGR1bmdlb24gPSBuZXcgY2hhcltWYWx1ZSwgVmFsdWVdO1xyXG4gICAgICAgICAgICB2YWx1ZSA9IFZhbHVlO1xyXG4gICAgICAgICAgICAvL0dlbmVyaWVyZSBEdW5nZW9uXHJcbiAgICAgICAgICAgIC8vVE9ETzogUsOkdW1lIGdlbmVyaWVyZW5cclxuICAgICAgICAgICAgZm9yIChpbnQgeSA9IDA7IHkgPCB2YWx1ZTsgeSsrKSB7XHJcbiAgICAgICAgICAgICAgICBmb3IgKGludCB4ID0gMDsgeCA8IHZhbHVlOyB4KyspIHtcclxuICAgICAgICAgICAgICAgICAgICBpZiAoeSA9PSAwIHx8IHkgPT0gdmFsdWUgLSAxKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGR1bmdlb25beSwgeF0gPSAnbyc7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIGlmICh4ID09IDAgfHwgeCA9PSB2YWx1ZSAtIDEpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgZHVuZ2Vvblt5LCB4XSA9ICdvJztcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmICgoeCAlIDIgPT0gMCkgfHwgKHkgJSAyID09IDApKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBkdW5nZW9uW3ksIHhdID0gJ28nO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZHVuZ2Vvblt5LCB4XSA9ICd4JztcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBHZW5lcmF0ZVJvb21Qb2ludHMoKTtcclxuICAgICAgICAgICAgR2VuZXJhdGVSb29tRnJvbVBvaW50cygpO1xyXG4gICAgICAgICAgICBHZW5lcmF0ZU1haW5XYXlzKCk7XHJcbiAgICAgICAgICAgIEdlbmVyYXRlT3RoZXJXYXlzKCk7XHJcbiAgICAgICAgICAgIENvbm5lY3RNYWluV2F5c1RvT3RoZXJXYXlzKCk7XHJcbiAgICAgICAgICAgIE1ha2VMZWZ0b3ZlclBvaW50c1RvQ3Jvc3NpbmdzKCk7XHJcbiAgICAgICAgICAgIFJlbW92ZVVzZWxlc3NEZWFkZW5kcygpO1xyXG4gICAgICAgICAgICBNYWtlUm9vbUNvbm5lY3Rpb25Db21wbGV0ZSgpO1xyXG4gICAgICAgICAgICBTZXRTcGF3bkFuZERlc3RpbmF0aW9uUG9pbnQoKTtcclxuICAgICAgICAgICAgUmVzZXRPdXRlcldhbGwoKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcHVibGljIFN0cmluZyBsb2coKSB7XHJcbiAgICAgICAgICAgIHN0cmluZyBsb2dpbmZvID0gXCJcIjtcclxuICAgICAgICAgICAgbG9naW5mbyArPSBcIlJhdW1wdW5rdGU6IFxcblwiO1xyXG4gICAgICAgICAgICBmb3IgKGludCBjID0gMDsgYyA8IHJvb21Qb2ludHNYLkNvdW50OyBjKyspIHtcclxuICAgICAgICAgICAgICAgIGxvZ2luZm8gKz0gXCJQdW5rdDogXCIgKyBcIlk6IFwiICsgcm9vbVBvaW50c1lbY10uVG9TdHJpbmcoKSArIFwiIFg6IFwiICsgcm9vbVBvaW50c1lbY10uVG9TdHJpbmcoKSArIFwiXFxuXCI7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgbG9naW5mbyArPSBcIsOEdXNlcmUgUmF1bXB1bmt0ZTogXFxuXCI7XHJcbiAgICAgICAgICAgIGZvciAoaW50IGMgPSAwOyBjIDwgcm9vbU91dGVyUG9pbnRzWC5Db3VudDsgYysrKSB7XHJcbiAgICAgICAgICAgICAgICBsb2dpbmZvICs9IFwiT3V0ZXJQdW5rdDogXCIgKyBcIlk6IFwiICsgcm9vbU91dGVyUG9pbnRzWVtjXS5Ub1N0cmluZygpICsgXCIgWDogXCIgKyByb29tT3V0ZXJQb2ludHNZW2NdLlRvU3RyaW5nKCkgKyBcIlxcblwiO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGxvZ2luZm8gKz0gXCJcXG4gV2lya2xpY2hlIFJhdW1wdW5rdGU6IFxcblwiO1xyXG4gICAgICAgICAgICBmb3IgKGludCBjID0gMDsgYyA8IGNob29zZVBvaW50WC5Db3VudDsgYysrKSB7XHJcbiAgICAgICAgICAgICAgICBsb2dpbmZvICs9IFwiUmVhbFB1bmt0OiBcIiArIFwiWTogXCIgKyBjaG9vc2VQb2ludFlbY10uVG9TdHJpbmcoKSArIFwiIFg6IFwiICsgY2hvb3NlUG9pbnRYW2NdLlRvU3RyaW5nKCkgKyBcIlxcblwiO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHJldHVybiBsb2dpbmZvO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcHVibGljIHZvaWQgUmVzZXRPdXRlcldhbGwoKSB7XHJcbiAgICAgICAgICAgIGZvciAoaW50IHkgPSAwOyB5IDwgdmFsdWU7IHkrKykge1xyXG4gICAgICAgICAgICAgICAgZm9yIChpbnQgeCA9IDA7IHggPCB2YWx1ZTsgeCsrKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKHkgPT0gMCB8fCB4ID09IHZhbHVlIC0gMSB8fCB4ID09IDAgfHwgeSA9PSB2YWx1ZSAtIDEpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgRHVuZ2Vvblt5LCB4XSA9ICdvJztcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHB1YmxpYyB2b2lkIEdlbmVyYXRlUm9vbVBvaW50cygpIHtcclxuICAgICAgICAgICAgUmFuZG9tIHJuZCA9IG5ldyBSYW5kb20oKTtcclxuICAgICAgICAgICAgaW50IG15dmFsID0gNjtcclxuICAgICAgICAgICAgaW50IG1heWJlUG9pbnQgPSB2YWx1ZSAvIDIgLSAxO1xyXG4gICAgICAgICAgICBpbnQgY291bnQgPSAwO1xyXG4gICAgICAgICAgICBib29sIHNldHJvb20gPSBmYWxzZTtcclxuICAgICAgICAgICAgaW50IGNob29zZVBvaW50ID0gcm5kLk5leHQoMCwgdmFsdWUgKiB2YWx1ZSAvIG15dmFsKTtcclxuICAgICAgICAgICAgZm9yIChpbnQgeSA9IDA7IHkgPCB2YWx1ZTsgeSsrKSB7XHJcblxyXG4gICAgICAgICAgICAgICAgZm9yIChpbnQgeCA9IDA7IHggPCB2YWx1ZTsgeCsrKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgY291bnQrKztcclxuICAgICAgICAgICAgICAgICAgICBpZiAoc2V0cm9vbSA9PSBmYWxzZSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoY291bnQgPT0gY2hvb3NlUG9pbnQpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRyeSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKER1bmdlb25beSAtIDEsIHhdID09ICd4Jykge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBEdW5nZW9uW3kgLSAxLCB4XSA9ICd3JztcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcm9vbVBvaW50c1kuQWRkKHkgLSAxKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcm9vbVBvaW50c1guQWRkKHgpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoRHVuZ2Vvblt5IC0gMSwgeCAtIDFdID09ICd4Jykge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBEdW5nZW9uW3kgLSAxLCB4IC0gMV0gPSAndyc7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJvb21Qb2ludHNZLkFkZCh5IC0gMSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJvb21Qb2ludHNYLkFkZCh4IC0gMSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChEdW5nZW9uW3ksIHggLSAxXSA9PSAneCcpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgRHVuZ2Vvblt5LCB4IC0gMV0gPSAndyc7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJvb21Qb2ludHNZLkFkZCh5KTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcm9vbVBvaW50c1guQWRkKHggLSAxKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKER1bmdlb25beSwgeF0gPT0gJ3gnKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIER1bmdlb25beSwgeF0gPSAndyc7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJvb21Qb2ludHNZLkFkZCh5KTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcm9vbVBvaW50c1guQWRkKHgpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzZXRyb29tID0gdHJ1ZTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNhdGNoIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjaG9vc2VQb2ludCsrO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICBpZiAodmFsdWUgKiB2YWx1ZSAvIG15dmFsID09IGNvdW50KSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNob29zZVBvaW50ID0gcm5kLk5leHQoMCwgdmFsdWUgKiB2YWx1ZSAvIG15dmFsKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgY291bnQgPSAwO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBzZXRyb29tID0gZmFsc2U7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaW50IGNoZWNrUm91bmRIb3VzZShpbnQgeSwgaW50IHgsIGNoYXIgZGlyZWN0aW9uKSB7XHJcbiAgICAgICAgICAgIGNoYXJbLF0gY29weSA9IER1bmdlb247XHJcbiAgICAgICAgICAgIGJvb2wgcG9zc2libGUgPSB0cnVlO1xyXG4gICAgICAgICAgICBpbnQgY291bnQgPSAwO1xyXG4gICAgICAgICAgICBzd2l0Y2ggKChkaXJlY3Rpb24uVG9TdHJpbmcoKS5Ub1VwcGVyKCkuVG9DaGFyQXJyYXkoKSlbMF0pIHtcclxuICAgICAgICAgICAgICAgIGNhc2UgJ1UnOlxyXG4gICAgICAgICAgICAgICAgICAgIHdoaWxlIChwb3NzaWJsZSA9PSB0cnVlKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRyeSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoY29weVt5IC0gY291bnQsIHhdID09IHgpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb3VudCArPSAyO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGNvdW50O1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNhdGNoIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBjb3VudDtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgIGNhc2UgJ0QnOlxyXG4gICAgICAgICAgICAgICAgICAgIHdoaWxlIChwb3NzaWJsZSA9PSB0cnVlKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRyeSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoY29weVt5ICsgY291bnQsIHhdID09IHgpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb3VudCArPSAyO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGNvdW50O1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNhdGNoIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBjb3VudDtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgIGNhc2UgJ0wnOlxyXG4gICAgICAgICAgICAgICAgICAgIHdoaWxlIChwb3NzaWJsZSA9PSB0cnVlKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRyeSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoY29weVt5LCB4IC0gY291bnRdID09IHgpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb3VudCArPSAyO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGNvdW50O1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNhdGNoIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBjb3VudDtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgIGNhc2UgJ1InOlxyXG4gICAgICAgICAgICAgICAgICAgIHdoaWxlIChwb3NzaWJsZSA9PSB0cnVlKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRyeSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoY29weVt5LCB4ICsgY291bnRdID09IHgpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb3VudCArPSAyO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGNvdW50O1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNhdGNoIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBjb3VudDtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgIGRlZmF1bHQ6XHJcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgcmV0dXJuIDE7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICB2b2lkIGV4cGFuZChjaGFyIGRpcmVjdGlvbiwgaW50IHdhbGsxLCBpbnQgd2FsazIsIGludCBwb3N5LCBpbnQgcG9zeCkge1xyXG4gICAgICAgICAgICBzd2l0Y2ggKChkaXJlY3Rpb24uVG9TdHJpbmcoKS5Ub1VwcGVyKCkuVG9DaGFyQXJyYXkoKSlbMF0pIHtcclxuICAgICAgICAgICAgICAgIGNhc2UgJ1UnOlxyXG4gICAgICAgICAgICAgICAgICAgIHJvb21PdXRlclBvaW50c1guQWRkKDApO1xyXG4gICAgICAgICAgICAgICAgICAgIHJvb21PdXRlclBvaW50c1kuQWRkKDApO1xyXG4gICAgICAgICAgICAgICAgICAgIGZvciAoaW50IHJhbmdlID0gMDsgcmFuZ2UgPD0gd2FsazE7IHJhbmdlKyspIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgZm9yIChpbnQgcmFuZ2UyID0gMDsgcmFuZ2UyIDw9IHdhbGsyOyByYW5nZTIrKykge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgRHVuZ2Vvbltwb3N5IC0gcmFuZ2UsIHBvc3ggKyByYW5nZTJdID0gJ3cnO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIER1bmdlb25bcG9zeSAtIHJhbmdlLCBwb3N4XSA9ICd3JztcclxuICAgICAgICAgICAgICAgICAgICAgICAgcm9vbU91dGVyUG9pbnRzWFtyb29tT3V0ZXJQb2ludHNYLkNvdW50IC0gMV0gPSBwb3N4ICogMjtcclxuICAgICAgICAgICAgICAgICAgICAgICAgcm9vbU91dGVyUG9pbnRzWVtyb29tT3V0ZXJQb2ludHNZLkNvdW50IC0gMV0gPSAocG9zeSAtIHJhbmdlKSAqIDI7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgY2FzZSAnRCc6XHJcbiAgICAgICAgICAgICAgICAgICAgcm9vbU91dGVyUG9pbnRzWC5BZGQoMCk7XHJcbiAgICAgICAgICAgICAgICAgICAgcm9vbU91dGVyUG9pbnRzWS5BZGQoMCk7XHJcbiAgICAgICAgICAgICAgICAgICAgZm9yIChpbnQgcmFuZ2UgPSAwOyByYW5nZSA8PSB3YWxrMTsgcmFuZ2UrKykge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBmb3IgKGludCByYW5nZTIgPSAwOyByYW5nZTIgPD0gd2FsazI7IHJhbmdlMisrKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBEdW5nZW9uW3Bvc3kgKyByYW5nZSwgcG9zeCArIHJhbmdlMl0gPSAndyc7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgRHVuZ2Vvbltwb3N5ICsgcmFuZ2UsIHBvc3hdID0gJ3cnO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICByb29tT3V0ZXJQb2ludHNYW3Jvb21PdXRlclBvaW50c1guQ291bnQgLSAxXSA9IHBvc3g7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHJvb21PdXRlclBvaW50c1lbcm9vbU91dGVyUG9pbnRzWS5Db3VudCAtIDFdID0gcG9zeSArIHJhbmdlO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgIGNhc2UgJ0wnOlxyXG4gICAgICAgICAgICAgICAgICAgIHJvb21PdXRlclBvaW50c1guQWRkKDApO1xyXG4gICAgICAgICAgICAgICAgICAgIHJvb21PdXRlclBvaW50c1kuQWRkKDApO1xyXG4gICAgICAgICAgICAgICAgICAgIGZvciAoaW50IHJhbmdlID0gMDsgcmFuZ2UgPD0gd2FsazE7IHJhbmdlKyspIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgZm9yIChpbnQgcmFuZ2UyID0gMDsgcmFuZ2UyIDw9IHdhbGsyOyByYW5nZTIrKykge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgRHVuZ2Vvbltwb3N5IC0gcmFuZ2UyLCBwb3N4IC0gcmFuZ2VdID0gJ3cnO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIER1bmdlb25bcG9zeSwgcG9zeCAtIHJhbmdlXSA9ICd3JztcclxuICAgICAgICAgICAgICAgICAgICAgICAgcm9vbU91dGVyUG9pbnRzWFtyb29tT3V0ZXJQb2ludHNYLkNvdW50IC0gMV0gPSBwb3N4IC0gcmFuZ2U7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHJvb21PdXRlclBvaW50c1lbcm9vbU91dGVyUG9pbnRzWS5Db3VudCAtIDFdID0gcG9zeTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICBjYXNlICdSJzpcclxuICAgICAgICAgICAgICAgICAgICByb29tT3V0ZXJQb2ludHNYLkFkZCgwKTtcclxuICAgICAgICAgICAgICAgICAgICByb29tT3V0ZXJQb2ludHNZLkFkZCgwKTtcclxuICAgICAgICAgICAgICAgICAgICBmb3IgKGludCByYW5nZSA9IDA7IHJhbmdlIDw9IHdhbGsxOyByYW5nZSsrKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGZvciAoaW50IHJhbmdlMiA9IDA7IHJhbmdlMiA8PSB3YWxrMjsgcmFuZ2UyKyspIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIER1bmdlb25bcG9zeSArIHJhbmdlMiwgcG9zeCAtIHJhbmdlXSA9ICd3JztcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICBEdW5nZW9uW3Bvc3ksIHBvc3ggKyByYW5nZV0gPSAndyc7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHJvb21PdXRlclBvaW50c1hbcm9vbU91dGVyUG9pbnRzWC5Db3VudCAtIDFdID0gcG9zeCArIHJhbmdlO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICByb29tT3V0ZXJQb2ludHNZW3Jvb21PdXRlclBvaW50c1kuQ291bnQgLSAxXSA9IHBvc3k7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgZGVmYXVsdDpcclxuICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcHVibGljIHZvaWQgR2VuZXJhdGVSb29tRnJvbVBvaW50cygpIHtcclxuXHJcblxyXG4gICAgICAgICAgICBpbnQgbWF4U2l6ZSA9IDQ7XHJcbiAgICAgICAgICAgIGludCBtaW5TaXplID0gMjtcclxuICAgICAgICAgICAgYm9vbCBvbmV0aW1lID0gZmFsc2U7XHJcblxyXG4gICAgICAgICAgICBmb3IgKGludCBjID0gMDsgYyA8IHJvb21Qb2ludHNYLkNvdW50OyBjKyspIHtcclxuICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICBpbnQgbWF4RXhwYW5kVXAgPSBjaGVja1JvdW5kSG91c2Uocm9vbVBvaW50c1lbY10sIHJvb21Qb2ludHNYW2NdLCAndScpO1xyXG4gICAgICAgICAgICAgICAgICAgIGludCBtYXhFeHBhbmREb3duID0gY2hlY2tSb3VuZEhvdXNlKHJvb21Qb2ludHNZW2NdLCByb29tUG9pbnRzWFtjXSwgJ2QnKTtcclxuICAgICAgICAgICAgICAgICAgICBpbnQgbWF4RXhwYW5kTGVmdCA9IGNoZWNrUm91bmRIb3VzZShyb29tUG9pbnRzWVtjXSwgcm9vbVBvaW50c1hbY10sICdsJyk7XHJcbiAgICAgICAgICAgICAgICAgICAgaW50IG1heEV4cGFuZFJpZ2h0ID0gY2hlY2tSb3VuZEhvdXNlKHJvb21Qb2ludHNZW2NdLCByb29tUG9pbnRzWFtjXSwgJ3InKTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgaW50IGNob29zZVJvb21TaXplID0gMDtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKG1heEV4cGFuZFVwID49IG1heFNpemUpIGNob29zZVJvb21TaXplICs9IG1heFNpemU7XHJcbiAgICAgICAgICAgICAgICAgICAgZWxzZSBpZiAobWF4RXhwYW5kVXAgPj0gbWluU2l6ZSAmJiBtYXhFeHBhbmRVcCA8IG1heFNpemUpIGNob29zZVJvb21TaXplICs9IG1pblNpemU7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIGlmIChtYXhFeHBhbmREb3duID49IG1heFNpemUpIGNob29zZVJvb21TaXplICs9IG1heFNpemU7XHJcbiAgICAgICAgICAgICAgICAgICAgZWxzZSBpZiAobWF4RXhwYW5kRG93biA+PSBtaW5TaXplICYmIG1heEV4cGFuZERvd24gPCBtYXhTaXplKSBjaG9vc2VSb29tU2l6ZSArPSBtaW5TaXplO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICBpZiAobWF4RXhwYW5kTGVmdCA+PSBtYXhTaXplKSBjaG9vc2VSb29tU2l6ZSArPSBtYXhTaXplO1xyXG4gICAgICAgICAgICAgICAgICAgIGVsc2UgaWYgKG1heEV4cGFuZExlZnQgPj0gbWluU2l6ZSAmJiBtYXhFeHBhbmRMZWZ0IDwgbWF4U2l6ZSkgY2hvb3NlUm9vbVNpemUgKz0gbWluU2l6ZTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKG1heEV4cGFuZFJpZ2h0ID49IG1heFNpemUpIGNob29zZVJvb21TaXplICs9IG1heFNpemU7XHJcbiAgICAgICAgICAgICAgICAgICAgZWxzZSBpZiAobWF4RXhwYW5kUmlnaHQgPj0gbWluU2l6ZSAmJiBtYXhFeHBhbmRSaWdodCA8IG1heFNpemUpIGNob29zZVJvb21TaXplICs9IG1pblNpemU7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBpZiAob25ldGltZSA9PSBmYWxzZSkge1xyXG4gICAgICAgICAgICAgICAgICAgIHRyeSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGV4cGFuZCgnZCcsIDIsIDIsIHJvb21Qb2ludHNZW2NdLCByb29tUG9pbnRzWFtjXSk7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIGNhdGNoIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgLy9ub25lXHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIHRyeSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGV4cGFuZCgnbCcsIDIsIDIsIHJvb21Qb2ludHNZW2NdLCByb29tUG9pbnRzWFtjXSk7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIGNhdGNoIHtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIHRyeSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGV4cGFuZCgncicsIDIsIDIsIHJvb21Qb2ludHNZW2NdLCByb29tUG9pbnRzWFtjXSk7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIGNhdGNoIHtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIHRyeSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGV4cGFuZCgndScsIDIsIDIsIHJvb21Qb2ludHNZW2NdLCByb29tUG9pbnRzWFtjXSk7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIGNhdGNoIHtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIG9uZXRpbWUgPSBmYWxzZTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgYm9vbCB3YWxrTmV4dChpbnQgeSwgaW50IHgsIGNoYXIgZGlyZWN0aW9uLCBjaGFyIHdheUFydCA9ICd0Jykge1xyXG4gICAgICAgICAgICBzd2l0Y2ggKChkaXJlY3Rpb24uVG9TdHJpbmcoKS5Ub1VwcGVyKCkuVG9DaGFyQXJyYXkoKSlbMF0pIHtcclxuICAgICAgICAgICAgICAgIGNhc2UgJ1UnOlxyXG4gICAgICAgICAgICAgICAgICAgIHRyeSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChEdW5nZW9uW3kgLSAyLCB4XSA9PSAneCcpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZvciAoaW50IGkgPSAwOyBpIDwgMzsgaSsrKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgRHVuZ2Vvblt5IC0gaSwgeF0gPSB3YXlBcnQ7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gdHJ1ZTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICBjYXRjaCB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBjYXNlICdEJzpcclxuICAgICAgICAgICAgICAgICAgICB0cnkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoRHVuZ2Vvblt5ICsgMiwgeF0gPT0gJ3gnKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBmb3IgKGludCBpID0gMDsgaSA8IDM7IGkrKykge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIER1bmdlb25beSArIGksIHhdID0gd2F5QXJ0O1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgY2F0Y2gge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgY2FzZSAnTCc6XHJcbiAgICAgICAgICAgICAgICAgICAgdHJ5IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKER1bmdlb25beSwgeCAtIDJdID09ICd4Jykge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZm9yIChpbnQgaSA9IDA7IGkgPCAzOyBpKyspIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBEdW5nZW9uW3ksIHggLSBpXSA9IHdheUFydDtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIGNhdGNoIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGNhc2UgJ1InOlxyXG4gICAgICAgICAgICAgICAgICAgIHRyeSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChEdW5nZW9uW3ksIHggKyAyXSA9PSAneCcpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZvciAoaW50IGkgPSAwOyBpIDwgMzsgaSsrKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgRHVuZ2Vvblt5LCB4ICsgaV0gPSB3YXlBcnQ7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gdHJ1ZTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICBjYXRjaCB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBkZWZhdWx0OlxyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICBib29sIHdhbGtPbmUoaW50IHksIGludCB4LCBjaGFyIGRpcmVjdG9yeSkge1xyXG4gICAgICAgICAgICB0cnkge1xyXG4gICAgICAgICAgICAgICAgc3dpdGNoICgoZGlyZWN0b3J5LlRvU3RyaW5nKCkuVG9VcHBlcigpLlRvQ2hhckFycmF5KCkpWzBdKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgY2FzZSAnVSc6XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIER1bmdlb25beSAtIDEsIHhdID0gJ2MnO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gdHJ1ZTtcclxuICAgICAgICAgICAgICAgICAgICBjYXNlICdEJzpcclxuICAgICAgICAgICAgICAgICAgICAgICAgRHVuZ2Vvblt5ICsgMSwgeF0gPSAnYyc7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgICAgICAgICAgICAgICAgIGNhc2UgJ0wnOlxyXG4gICAgICAgICAgICAgICAgICAgICAgICBEdW5nZW9uW3ksIHggLSAxXSA9ICdjJztcclxuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICAgICAgICAgICAgICAgICAgY2FzZSAnUic6XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIER1bmdlb25beSwgeCArIDFdID0gJ2MnO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gdHJ1ZTtcclxuICAgICAgICAgICAgICAgICAgICBkZWZhdWx0OlxyXG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgY2F0Y2gge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGJvb2wgY2hlY2tOZXh0KGludCB5LCBpbnQgeCwgY2hhciBkaXJlY3Rpb24pIHtcclxuICAgICAgICAgICAgc3dpdGNoICgoZGlyZWN0aW9uLlRvU3RyaW5nKCkuVG9VcHBlcigpLlRvQ2hhckFycmF5KCkpWzBdKSB7XHJcbiAgICAgICAgICAgICAgICBjYXNlICdVJzpcclxuICAgICAgICAgICAgICAgICAgICB0cnkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoRHVuZ2Vvblt5IC0gMiwgeF0gPT0gJ3gnKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gdHJ1ZTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICBjYXRjaCB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBjYXNlICdEJzpcclxuICAgICAgICAgICAgICAgICAgICB0cnkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoRHVuZ2Vvblt5ICsgMiwgeF0gPT0gJ3gnKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gdHJ1ZTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICBjYXRjaCB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBjYXNlICdMJzpcclxuICAgICAgICAgICAgICAgICAgICB0cnkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoRHVuZ2Vvblt5LCB4IC0gMl0gPT0gJ3gnKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gdHJ1ZTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICBjYXRjaCB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBjYXNlICdSJzpcclxuICAgICAgICAgICAgICAgICAgICB0cnkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoRHVuZ2Vvblt5LCB4ICsgMl0gPT0gJ3gnKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gdHJ1ZTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICBjYXRjaCB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBkZWZhdWx0OlxyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICBib29sIGNoZWNrU2lkZShpbnQgeSwgaW50IHgsIGNoYXIgZGlyZWN0aW9uKSB7XHJcbiAgICAgICAgICAgIHRyeSB7XHJcbiAgICAgICAgICAgICAgICBzd2l0Y2ggKChkaXJlY3Rpb24uVG9TdHJpbmcoKS5Ub1VwcGVyKCkuVG9DaGFyQXJyYXkoKSlbMF0pIHtcclxuICAgICAgICAgICAgICAgICAgICBjYXNlICdVJzpcclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKER1bmdlb25beSArIDEsIHhdID09ICdvJykge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICBjYXNlICdEJzpcclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKER1bmdlb25beSAtIDEsIHhdID09ICdvJykge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICBjYXNlICdMJzpcclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKER1bmdlb25beSwgeCAtIDFdID09ICdvJykge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICBjYXNlICdSJzpcclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKER1bmdlb25beSwgeCArIDFdID09ICdvJykge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICBkZWZhdWx0OlxyXG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgY2F0Y2gge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgIH1cclxuICAgICAgICBib29sIG1vZGVsQ2hlY2soaW50IHksIGludCB4LCBjaGFyIGRpcmVjdG9yeSkge1xyXG4gICAgICAgICAgICBpbnQgY291bnRWYXIgPSAwO1xyXG4gICAgICAgICAgICAvL1RPRE86IHByw7xmZSBvYiBzZXRibG9jayBzY2hvbiBlaW4gV2VnIGlzdCAhIVxyXG4gICAgICAgICAgICB0cnkge1xyXG4gICAgICAgICAgICAgICAgc3dpdGNoICgoZGlyZWN0b3J5LlRvU3RyaW5nKCkuVG9VcHBlcigpLlRvQ2hhckFycmF5KCkpWzBdKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgY2FzZSAnVSc6XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHkgPSB5IC0gMjtcclxuICAgICAgICAgICAgICAgICAgICAgICAgeCA9IHggLSAxO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgICAgICBjYXNlICdEJzpcclxuICAgICAgICAgICAgICAgICAgICAgICAgeCA9IHggLSAxO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgICAgICBjYXNlICdMJzpcclxuICAgICAgICAgICAgICAgICAgICAgICAgeSA9IHkgLSAxO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgICAgICBjYXNlICdSJzpcclxuICAgICAgICAgICAgICAgICAgICAgICAgeSA9IHkgLSAxO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB4ID0geCAtIDI7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgICAgIGRlZmF1bHQ6XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgZm9yIChpbnQgeTEgPSAwOyB5MSA8IDM7IHkxKyspIHtcclxuICAgICAgICAgICAgICAgICAgICBmb3IgKGludCB4MSA9IDA7IHgxIDwgMzsgeDErKykge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoRHVuZ2Vvblt5ICsgeTEsIHggKyB4MV0gPT0gJ28nKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb3VudFZhcisrO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGNhdGNoIHtcclxuXHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIGlmIChjb3VudFZhciA+PSA1KSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gdHJ1ZTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcHVibGljIHZvaWQgR2VuZXJhdGVNYWluV2F5cygpIHtcclxuICAgICAgICAgICAgTGlzdDxpbnQ+IHdhbGtQb2ludHNZID0gbmV3IExpc3Q8aW50PigpO1xyXG4gICAgICAgICAgICBMaXN0PGludD4gd2Fsa1BvaW50c1ggPSBuZXcgTGlzdDxpbnQ+KCk7XHJcbiAgICAgICAgICAgIGZvciAoaW50IGkgPSAwOyBpIDwgcm9vbU91dGVyUG9pbnRzWC5Db3VudDsgaSsrKSB7XHJcbiAgICAgICAgICAgICAgICB0cnkge1xyXG4gICAgICAgICAgICAgICAgICAgIGlmIChEdW5nZW9uW3Jvb21PdXRlclBvaW50c1lbaV0sIHJvb21PdXRlclBvaW50c1hbaV1dID09ICd3Jykge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBjaG9vc2VQb2ludFkuQWRkKHJvb21PdXRlclBvaW50c1lbaV0pO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBjaG9vc2VQb2ludFguQWRkKHJvb21PdXRlclBvaW50c1hbaV0pO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGNhdGNoIHtcclxuICAgICAgICAgICAgICAgICAgICAvL25vbmVcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG5cclxuXHJcblxyXG4gICAgICAgICAgICBmb3IgKGludCBpID0gMDsgaSA8IGNob29zZVBvaW50WC5Db3VudDsgaSsrKSB7XHJcbiAgICAgICAgICAgICAgICAvL1VQXHJcbiAgICAgICAgICAgICAgICBpZiAoY2hlY2tOZXh0KGNob29zZVBvaW50WVtpXSwgY2hvb3NlUG9pbnRYW2ldLCAndScpID09IHRydWUpIHtcclxuICAgICAgICAgICAgICAgICAgICB3YWxrUG9pbnRzWS5BZGQoY2hvb3NlUG9pbnRZW2ldIC0gMik7XHJcbiAgICAgICAgICAgICAgICAgICAgd2Fsa1BvaW50c1guQWRkKGNob29zZVBvaW50WFtpXSk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAvL0RPV05cclxuICAgICAgICAgICAgICAgIGlmIChjaGVja05leHQoY2hvb3NlUG9pbnRZW2ldLCBjaG9vc2VQb2ludFhbaV0sICdkJykgPT0gdHJ1ZSkge1xyXG4gICAgICAgICAgICAgICAgICAgIHdhbGtQb2ludHNZLkFkZChjaG9vc2VQb2ludFlbaV0gKyAyKTtcclxuICAgICAgICAgICAgICAgICAgICB3YWxrUG9pbnRzWC5BZGQoY2hvb3NlUG9pbnRYW2ldKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIC8vTEVGVFxyXG4gICAgICAgICAgICAgICAgaWYgKGNoZWNrTmV4dChjaG9vc2VQb2ludFlbaV0sIGNob29zZVBvaW50WFtpXSwgJ2wnKSA9PSB0cnVlKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgd2Fsa1BvaW50c1kuQWRkKGNob29zZVBvaW50WVtpXSk7XHJcbiAgICAgICAgICAgICAgICAgICAgd2Fsa1BvaW50c1guQWRkKGNob29zZVBvaW50WFtpXSAtIDIpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgLy9SSUdIVFxyXG4gICAgICAgICAgICAgICAgaWYgKGNoZWNrTmV4dChjaG9vc2VQb2ludFlbaV0sIGNob29zZVBvaW50WFtpXSwgJ3InKSA9PSB0cnVlKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgd2Fsa1BvaW50c1kuQWRkKGNob29zZVBvaW50WVtpXSk7XHJcbiAgICAgICAgICAgICAgICAgICAgd2Fsa1BvaW50c1guQWRkKGNob29zZVBvaW50WFtpXSArIDIpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGlmICh3YWxrUG9pbnRzWC5Db3VudCA9PSAwKSB7XHJcbiAgICAgICAgICAgICAgICAvL0xldmVsTmV1R2VuZXJpZXJlblxyXG4gICAgICAgICAgICB9XHJcblxyXG5cclxuICAgICAgICAgICAgUmFuZG9tIHJuZCA9IG5ldyBSYW5kb20oKTtcclxuICAgICAgICAgICAgZm9yIChpbnQgaSA9IDA7IGkgPCB3YWxrUG9pbnRzWC5Db3VudDsgaSsrKSB7XHJcbiAgICAgICAgICAgICAgICAvL1dhbGtEb3duXHJcbiAgICAgICAgICAgICAgICBpbnQgeSA9IDA7XHJcbiAgICAgICAgICAgICAgICBpbnQgeCA9IDA7XHJcbiAgICAgICAgICAgICAgICBpZiAoY2hlY2tOZXh0KHdhbGtQb2ludHNZW2ldLCB3YWxrUG9pbnRzWFtpXSwgJ3UnKSkge1xyXG4gICAgICAgICAgICAgICAgICAgIHdhbGtOZXh0KHdhbGtQb2ludHNZW2ldLCB3YWxrUG9pbnRzWFtpXSwgJ3UnKTtcclxuICAgICAgICAgICAgICAgICAgICB5ID0gd2Fsa1BvaW50c1lbaV0gLSAyO1xyXG4gICAgICAgICAgICAgICAgICAgIHggPSB3YWxrUG9pbnRzWFtpXTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGVsc2UgaWYgKGNoZWNrTmV4dCh3YWxrUG9pbnRzWVtpXSwgd2Fsa1BvaW50c1hbaV0sICdkJykpIHtcclxuICAgICAgICAgICAgICAgICAgICB3YWxrTmV4dCh3YWxrUG9pbnRzWVtpXSwgd2Fsa1BvaW50c1hbaV0sICdkJyk7XHJcbiAgICAgICAgICAgICAgICAgICAgeSA9IHdhbGtQb2ludHNZW2ldICsgMjtcclxuICAgICAgICAgICAgICAgICAgICB4ID0gd2Fsa1BvaW50c1hbaV07XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBlbHNlIGlmIChjaGVja05leHQod2Fsa1BvaW50c1lbaV0sIHdhbGtQb2ludHNYW2ldLCAnbCcpKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgd2Fsa05leHQod2Fsa1BvaW50c1lbaV0sIHdhbGtQb2ludHNYW2ldLCAnbCcpO1xyXG4gICAgICAgICAgICAgICAgICAgIHkgPSB3YWxrUG9pbnRzWVtpXTtcclxuICAgICAgICAgICAgICAgICAgICB4ID0gd2Fsa1BvaW50c1hbaV0gLSAyO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgZWxzZSBpZiAoY2hlY2tOZXh0KHdhbGtQb2ludHNZW2ldLCB3YWxrUG9pbnRzWFtpXSwgJ3InKSkge1xyXG4gICAgICAgICAgICAgICAgICAgIHdhbGtOZXh0KHdhbGtQb2ludHNZW2ldLCB3YWxrUG9pbnRzWFtpXSwgJ3InKTtcclxuICAgICAgICAgICAgICAgICAgICB5ID0gd2Fsa1BvaW50c1lbaV07XHJcbiAgICAgICAgICAgICAgICAgICAgeCA9IHdhbGtQb2ludHNYW2ldICsgMjtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbnRpbnVlO1xyXG4gICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgIGludCBjb3VudGVyID0gMDtcclxuXHJcbiAgICAgICAgICAgICAgICBMaXN0PGludD4gY2hvb3NlRnJvbVRoaXMgPSBuZXcgTGlzdDxpbnQ+KCk7XHJcbiAgICAgICAgICAgICAgICBjaG9vc2VGcm9tVGhpcyA9IG5ldyBMaXN0PGludD4oKTtcclxuICAgICAgICAgICAgICAgIGNob29zZUZyb21UaGlzLkFkZCgxKTtcclxuICAgICAgICAgICAgICAgIGNob29zZUZyb21UaGlzLkFkZCgyKTtcclxuICAgICAgICAgICAgICAgIGNob29zZUZyb21UaGlzLkFkZCgzKTtcclxuICAgICAgICAgICAgICAgIGNob29zZUZyb21UaGlzLkFkZCg0KTtcclxuXHJcbiAgICAgICAgICAgICAgICB3aGlsZSAoY2hlY2tOZXh0KHksIHgsICd1JykgPT0gdHJ1ZSB8fCBjaGVja05leHQoeSwgeCwgJ2QnKSA9PSB0cnVlIHx8IGNoZWNrTmV4dCh5LCB4LCAnbCcpID09IHRydWUgfHwgY2hlY2tOZXh0KHksIHgsICdyJykgPT0gdHJ1ZSkge1xyXG4gICAgICAgICAgICAgICAgICAgIGlmIChjb3VudGVyID49IDUwMCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgaW50IGRpciA9IHJuZC5OZXh0KDAsIGNob29zZUZyb21UaGlzLkNvdW50IC0gMSk7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIHN3aXRjaCAoY2hvb3NlRnJvbVRoaXNbZGlyXSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBjYXNlIDE6XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoY2hlY2tOZXh0KHksIHgsICd1JykpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB3YWxrTmV4dCh5LCB4LCAndScpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHkgPSB5IC0gMjtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjaG9vc2VGcm9tVGhpcyA9IG5ldyBMaXN0PGludD4oKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjaG9vc2VGcm9tVGhpcy5BZGQoMik7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2hvb3NlRnJvbVRoaXMuQWRkKDMpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNob29zZUZyb21UaGlzLkFkZCg0KTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBjYXNlIDI6XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoY2hlY2tOZXh0KHksIHgsICdkJykpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB3YWxrTmV4dCh5LCB4LCAnZCcpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHkgPSB5ICsgMjtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjaG9vc2VGcm9tVGhpcyA9IG5ldyBMaXN0PGludD4oKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjaG9vc2VGcm9tVGhpcy5BZGQoMSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2hvb3NlRnJvbVRoaXMuQWRkKDMpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNob29zZUZyb21UaGlzLkFkZCg0KTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBjYXNlIDM6XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoY2hlY2tOZXh0KHksIHgsICdsJykpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB3YWxrTmV4dCh5LCB4LCAnbCcpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHggPSB4IC0gMjtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjaG9vc2VGcm9tVGhpcyA9IG5ldyBMaXN0PGludD4oKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjaG9vc2VGcm9tVGhpcy5BZGQoMSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2hvb3NlRnJvbVRoaXMuQWRkKDIpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNob29zZUZyb21UaGlzLkFkZCg0KTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBjYXNlIDQ6XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoY2hlY2tOZXh0KHksIHgsICdyJykpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB3YWxrTmV4dCh5LCB4LCAncicpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHggPSB4ICsgMjtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjaG9vc2VGcm9tVGhpcyA9IG5ldyBMaXN0PGludD4oKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjaG9vc2VGcm9tVGhpcy5BZGQoMSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2hvb3NlRnJvbVRoaXMuQWRkKDIpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNob29zZUZyb21UaGlzLkFkZCgzKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBkZWZhdWx0OlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIGNvdW50ZXIrKztcclxuXHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgLy9HZW5lcmllcmUgV2VnZSB2b24gZGVuIE1pdHRlbiBkZXIgUsOkdW1lblxyXG4gICAgICAgIH1cclxuICAgICAgICBwdWJsaWMgdm9pZCBHZW5lcmF0ZU90aGVyV2F5cygpIHtcclxuXHJcbiAgICAgICAgICAgIGZvciAoaW50IHkgPSAwOyB5IDwgdmFsdWU7IHkrKykge1xyXG4gICAgICAgICAgICAgICAgZm9yIChpbnQgeCA9IDA7IHggPCB2YWx1ZTsgeCsrKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKER1bmdlb25beSwgeF0gPT0gJ3gnKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGludCB5MiA9IHk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGludCB4MiA9IHg7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHdoaWxlIChjaGVja05leHQoeTIsIHgyLCAndScpIHx8IGNoZWNrTmV4dCh5MiwgeDIsICdkJykgfHwgY2hlY2tOZXh0KHkyLCB4MiwgJ2wnKSB8fCBjaGVja05leHQoeTIsIHgyLCAncicpKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoY2hlY2tOZXh0KHkyLCB4MiwgJ3UnKSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHdhbGtOZXh0KHkyLCB4MiwgJ3UnLCAndScpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHkyIC09IDI7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoY2hlY2tOZXh0KHkyLCB4MiwgJ2QnKSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHdhbGtOZXh0KHkyLCB4MiwgJ2QnLCAndScpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHkyICs9IDI7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoY2hlY2tOZXh0KHkyLCB4MiwgJ2wnKSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHdhbGtOZXh0KHkyLCB4MiwgJ2wnLCAndScpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHgyIC09IDI7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoY2hlY2tOZXh0KHkyLCB4MiwgJ3InKSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHdhbGtOZXh0KHkyLCB4MiwgJ3InLCAndScpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHgyICs9IDI7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHByaXZhdGUgdm9pZCBDb25uZWN0TWFpbldheXNUb090aGVyV2F5cygpIHtcclxuXHJcbiAgICAgICAgICAgIGZvciAoaW50IHkgPSAwOyB5IDwgdmFsdWU7IHkrKykge1xyXG4gICAgICAgICAgICAgICAgZm9yIChpbnQgeCA9IDA7IHggPCB2YWx1ZTsgeCsrKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKER1bmdlb25beSwgeF0gPT0gJ3QnKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChtb2RlbENoZWNrKHksIHgsICd1JykpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHdhbGtPbmUoeSwgeCwgJ3UnKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAobW9kZWxDaGVjayh5LCB4LCAnZCcpKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB3YWxrT25lKHksIHgsICdkJyk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKG1vZGVsQ2hlY2soeSwgeCwgJ2wnKSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgd2Fsa09uZSh5LCB4LCAnbCcpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChtb2RlbENoZWNrKHksIHgsICdyJykpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHdhbGtPbmUoeSwgeCwgJ3InKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICBwcml2YXRlIHZvaWQgTWFrZUxlZnRvdmVyUG9pbnRzVG9Dcm9zc2luZ3MoKSB7XHJcblxyXG4gICAgICAgICAgICBmb3IgKGludCB5ID0gMDsgeSA8IHZhbHVlOyB5KyspIHtcclxuICAgICAgICAgICAgICAgIGZvciAoaW50IHggPSAwOyB4IDwgdmFsdWU7IHgrKykge1xyXG4gICAgICAgICAgICAgICAgICAgIGlmIChEdW5nZW9uW3ksIHhdID09ICd4Jykge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBpbnQgY291bnQgPSAwO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBpbnQgeTIgPSB5IC0gMTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgaW50IHgyID0geCAtIDE7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICBmb3IgKGludCBpID0gMDsgaSA8IDM7IGkrKykge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZm9yIChpbnQgYSA9IDA7IGEgPCAzOyBhKyspIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0cnkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoRHVuZ2Vvblt5MiArIGksIHgyICsgYV0gIT0gJ28nKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb3VudCsrO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNhdGNoIHtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGNvdW50ID49IDIpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIER1bmdlb25beSwgeF0gPSAndic7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBEdW5nZW9uW3ksIHhdID0gJ3YnO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIER1bmdlb25beSAtIDEsIHhdID0gJ3YnO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgRHVuZ2Vvblt5ICsgMSwgeF0gPSAndic7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBEdW5nZW9uW3ksIHggLSAxXSA9ICd2JztcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIER1bmdlb25beSwgeCArIDFdID0gJ3YnO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICBwcml2YXRlIHZvaWQgUmVtb3ZlVXNlbGVzc0RlYWRlbmRzKCkge1xyXG5cclxuICAgICAgICAgICAgZm9yIChpbnQgeSA9IDA7IHkgPCB2YWx1ZTsgeSsrKSB7XHJcbiAgICAgICAgICAgICAgICBmb3IgKGludCB4ID0gMDsgeCA8IHZhbHVlOyB4KyspIHtcclxuICAgICAgICAgICAgICAgICAgICBpZiAoRHVuZ2Vvblt5LCB4XSAhPSAnbycpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgaW50IHkyID0geSAtIDE7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGludCB4MiA9IHggLSAxO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBpbnQgY291bnQgPSAwO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgZm9yIChpbnQgaSA9IDA7IGkgPCAzOyBpKyspIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZvciAoaW50IGEgPSAwOyBhIDwgMzsgYSsrKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdHJ5IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKER1bmdlb25beTIgKyBpLCB4MiArIGFdICE9ICdvJykge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY291bnQrKztcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjYXRjaCB7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGNvdW50IDw9IDIpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRyeSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKER1bmdlb25beSAtIDEsIHhdICE9ICdvJykgeyAvL1VQXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIER1bmdlb25beSArIDEsIHhdID0gJ2MnO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBlbHNlIGlmIChEdW5nZW9uW3kgKyAxLCB4XSAhPSAnbycpIHsgLy9ET1dOXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIER1bmdlb25beSAtIDEsIHhdID0gJ2MnO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBlbHNlIGlmIChEdW5nZW9uW3ksIHggLSAxXSAhPSAnbycpIHsgLy9MRUZUXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIER1bmdlb25beSwgeCArIDFdID0gJ2MnO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBlbHNlIGlmIChEdW5nZW9uW3ksIHggKyAxXSAhPSAnbycpIHsgLy9SSUdIVFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBEdW5nZW9uW3ksIHggLSAxXSA9ICdjJztcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjYXRjaCB7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHByaXZhdGUgdm9pZCBNYWtlUm9vbUNvbm5lY3Rpb25Db21wbGV0ZSgpIHtcclxuXHJcblxyXG5cclxuICAgICAgICAgICAgZm9yIChpbnQgaSA9IDA7IGkgPCBjaG9vc2VQb2ludFguQ291bnQ7IGkrKykge1xyXG4gICAgICAgICAgICAgICAgaWYgKGNoZWNrU2lkZShjaG9vc2VQb2ludFlbaV0sIGNob29zZVBvaW50WFtpXSwgJ3UnKSkge1xyXG4gICAgICAgICAgICAgICAgICAgIHRyeSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIER1bmdlb25bY2hvb3NlUG9pbnRZW2ldICsgMSwgY2hvb3NlUG9pbnRYW2ldXSA9ICdjJztcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgY2F0Y2gge1xyXG5cclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBpZiAoY2hlY2tTaWRlKGNob29zZVBvaW50WVtpXSwgY2hvb3NlUG9pbnRYW2ldLCAnZCcpKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdHJ5IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgRHVuZ2VvbltjaG9vc2VQb2ludFlbaV0gLSAxLCBjaG9vc2VQb2ludFhbaV1dID0gJ2MnO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICBjYXRjaCB7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGlmIChjaGVja1NpZGUoY2hvb3NlUG9pbnRZW2ldLCBjaG9vc2VQb2ludFhbaV0sICdsJykpIHtcclxuICAgICAgICAgICAgICAgICAgICB0cnkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBEdW5nZW9uW2Nob29zZVBvaW50WVtpXSwgY2hvb3NlUG9pbnRYW2ldIC0gMV0gPSAnYyc7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIGNhdGNoIHtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgaWYgKGNoZWNrU2lkZShjaG9vc2VQb2ludFlbaV0sIGNob29zZVBvaW50WFtpXSwgJ3InKSkge1xyXG4gICAgICAgICAgICAgICAgICAgIHRyeSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIER1bmdlb25bY2hvb3NlUG9pbnRZW2ldLCBjaG9vc2VQb2ludFhbaV0gKyAxXSA9ICdjJztcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgY2F0Y2gge1xyXG5cclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgcHJpdmF0ZSB2b2lkIFNldFNwYXduQW5kRGVzdGluYXRpb25Qb2ludCgpIHtcclxuICAgICAgICAgICAgdHJ5IHtcclxuICAgICAgICAgICAgICAgIC8vU3Bhd25cclxuICAgICAgICAgICAgICAgIER1bmdlb25bcm9vbVBvaW50c1lbMF0sIHJvb21Qb2ludHNYWzBdXSA9ICdzJztcclxuICAgICAgICAgICAgICAgIC8vRGVzdGluYXRpb25cclxuICAgICAgICAgICAgICAgIER1bmdlb25bcm9vbVBvaW50c1lbcm9vbVBvaW50c1kuQ291bnQgLSAxXSwgcm9vbVBvaW50c1hbcm9vbVBvaW50c1guQ291bnQgLSAxXV0gPSAnZSc7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgY2F0Y2gge1xyXG5cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBjbGFzcyBQcm9ncmFtIHtcclxuICAgICAgICBzdGF0aWMgdm9pZCBNYWluKHN0cmluZ1tdIGFyZ3MpIHtcclxuXHJcbiAgICAgICAgICAgIExhYnlyaW50aCBteWxhYiA9IG5ldyBMYWJ5cmludGgoMzUpO1xyXG5cclxuICAgICAgICAgICAgZm9yIChpbnQgeSA9IDA7IHkgPCAzNTsgeSsrKSB7XHJcbiAgICAgICAgICAgICAgICBmb3IgKGludCB4ID0gMDsgeCA8IDM1OyB4KyspIHtcclxuICAgICAgICAgICAgICAgICAgICBDb25zb2xlLldyaXRlKG15bGFiLkR1bmdlb25beSwgeF0pO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgQ29uc29sZS5Xcml0ZUxpbmUoXCJcXG5cIik7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59XHJcbiJdCn0K
