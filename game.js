let statki = {
    cmp: [],
    cmp2: [],
    player: [],
    player2: [],
    podglad: false,
    doTrafieniaGracz: 0,
    doTrafieniaKomputer: 0,
    trybSprawdzania: 0,
    komputerWylosowane: 0,
    wypelnijPolaKomputer: [],
    wypelnijPolaGracz: [],
    inteligencjaPola: [],
    inteligencjaNajdluzszy: 4,
    dobijanie: false,
    dobijanieX: 0,
    dobijanieY: 0,
    dobijanieKierunek: 0,
    dobijanieMnoznik: 0,
    dobijaniePoprzedniPunkt: 0,
    dobijanieKierunekPoprawny: 0,
    maszty: [4, 3, 3, 2, 2, 2, 1, 1, 1, 1],
    tablica: function () {
        for (var i = 0; i < 12; i++) {
            for (var j = 0; j < 12; j++) {
                this.cmp[i] = []
                this.cmp2[i] = []
                this.player[i] = []
                this.player2[i] = []
                this.wypelnijPolaKomputer[i] = []
                this.wypelnijPolaGracz[i] = []
                this.inteligencjaPola[i] = []
                for (var j = 0; j < 12; j++) {
                    this.cmp2[i][j] = 0
                    this.player2[i][j] = 0
                    this.wypelnijPolaKomputer[i][j] = 0
                    this.wypelnijPolaGracz[i][j] = 0
                    this.inteligencjaPola[i][j] = 0
                }
            }
        }
    },
    start: function () {
        this.tablica()
        for (var i = 0; i < this.maszty.length; i++) {
            this.wstawKomputer(this.maszty[i])
        }
        this.html()
        this.wstawGracz(this.maszty, this.player, this.player2)
    },
    html: function () {
        for (var i = 1; i < 11; i++) {
            for (var j = 1; j < 11; j++) {
                var div1 = document.createElement("div")
                var div2 = document.createElement("div")
                this.player[i][j] = div1
                this.cmp[i][j] = div2
                div1.className = "pole"
                div2.className = "pole"
                document.getElementById("player").appendChild(div1)
                if (this.podglad) div2.innerHTML = this.cmp2[i][j]
                //if (this.cmp2[i][j] == 1) div2.classList.add("red")
                document.getElementById("cmp").appendChild(div2)
            }
        }
    },
    wstawGracz: function (stateczki, pola, polaJakie) {
        var kierunek = false
        var that = this
        for (var i = 0; i < stateczki.length; i++) {
            var statek = document.createElement("div")
            statek.classList.add("statek")
            document.getElementById("stateczki").appendChild(statek)
            for (var j = 0; j < stateczki[i]; j++) {
                var div = document.createElement("div")
                div.classList.add("pole2")
                statek.appendChild(div)
                if (statek.children.length == 4) {
                    zaznaczony = statek
                    for (var k = 0; k < zaznaczony.children.length; k++) {
                        zaznaczony.children[k].classList.add("blue")
                    }
                }
            }
            statek.addEventListener("mouseover", function () {
                for (var j = 0; j < this.children.length; j++) {
                    if (this != zaznaczony) this.children[j].classList.add("red")
                }
            }, false)
            statek.addEventListener("mouseout", function () {
                for (var j = 0; j < this.children.length; j++) {
                    this.children[j].classList.remove("red")
                }
            }, false)
            statek.addEventListener("click", function () {
                for (var j = 0; j < zaznaczony.children.length; j++) {
                    zaznaczony.children[j].classList.remove("blue")
                }
                for (var j = 0; j < this.children.length; j++) {
                    this.children[j].classList.remove("red")
                    this.children[j].classList.add("blue")
                }
                zaznaczony = this
            }, false)
        }
        for (let i = 1; i < 11; i++) {
            for (let j = 1; j < 11; j++) {
                function zaznacz() {
                    var wybraneX = []
                    var wybraneY = []
                    var zajete = false
                    if (kierunek) {
                        for (let y = i - 1; y < i + zaznaczony.children.length + 1; y++) {
                            for (let x = j - 1; x < j + 2; x++) {
                                var z = y
                                if (z > 10) z -= zaznaczony.children.length + 1
                                if (polaJakie[z][x] == 1) zajete = true
                            }
                        }
                    } else {
                        for (let y = i - 1; y < i + 2; y++) {
                            for (let x = j - 1; x < j + zaznaczony.children.length + 1; x++) {
                                var z = x
                                if (z > 10) z -= zaznaczony.children.length + 1
                                if (polaJakie[y][z] == 1) zajete = true
                            }
                        }
                    }
                    for (let k = 0; k < zaznaczony.children.length; k++) {
                        var k1 = k
                        var k2 = 0
                        if (!kierunek) k1 = 0, k2 = k
                        if (i + k1 > 10) k1 -= zaznaczony.children.length
                        if (j + k2 > 10) k2 -= zaznaczony.children.length
                        if (zajete) pola[i + k1][j + k2].classList.add("red")
                        else pola[i + k1][j + k2].classList.add("green")
                        wybraneY.push(i + k1)
                        wybraneX.push(j + k2)
                    }
                    return [wybraneX, wybraneY, zajete]
                }
                function wybierz() {
                    var zaznaczReturn = zaznacz()
                    if (!zaznaczReturn[2]) {
                        var x = zaznaczReturn[0]
                        var y = zaznaczReturn[1]
                        for (let k = 0; k < x.length; k++) {
                            pola[y[k]][x[k]].classList.remove("green")
                            pola[y[k]][x[k]].classList.add("blue")
                            polaJakie[y[k]][x[k]] = 1
                        }
                        zaznaczony.innerHTML = ""
                        zaznaczony.remove()
                        if (document.getElementById("stateczki").children.length == 0) that.gra()
                    }
                }
                function wyczysc() {
                    for (let i = 1; i < 11; i++) {
                        for (let j = 1; j < 11; j++) {
                            pola[i][j].classList.remove("green")
                            pola[i][j].classList.remove("red")
                        }
                    }
                }
                pola[i][j].addEventListener("contextmenu", function (e) {
                    kierunek = !kierunek
                    e.preventDefault()
                    wyczysc()
                    zaznacz()
                }, false)
                pola[i][j].addEventListener("mouseover", zaznacz, false)
                pola[i][j].addEventListener("mouseout", wyczysc, false)
                pola[i][j].onclick = wybierz
            }
        }
    },
    wstawKomputer: function (ile) {
        var ponow = true
        while (ponow) {
            var kierunek = Math.floor(Math.random() * 2)
            var x = Math.floor(Math.random() * 10 + 1)
            var y = Math.floor(Math.random() * 10 + 1)
            if (((!kierunek) && (x <= 11 - ile)) || ((kierunek) && (y <= 11 - ile))) {
                ponow = false
                if (!kierunek) a = y, b = x
                else a = x, b = y
                for (var i = b - 1; i < b + ile + 1; i++) {
                    for (var j = a - 1; j < a + 2; j++) {
                        if ((!kierunek) && (this.cmp2[j][i] == 1)) ponow = true
                        else if (this.cmp2[i][j] == 1) ponow = true
                    }
                }
                if (!ponow) {
                    for (var i = b; i < b + ile; i++) {
                        if (!kierunek) this.cmp2[y][i] = 1
                        else this.cmp2[i][x] = 1
                    }
                }
            }
        }
    },
    gra: function () {
        for (let i = 1; i < 11; i++) {
            for (let j = 1; j < 11; j++) {
                this.player[i][j].onclick = null
                if (this.cmp2[i][j]) this.doTrafieniaGracz++
                if (this.player2[i][j]) this.doTrafieniaKomputer++
            }
        }
        var that = this
        var przyciskStart = document.createElement("button")
        przyciskStart.innerHTML = "ROZPOCZNIJ GRE"
        document.body.appendChild(przyciskStart)
        przyciskStart.addEventListener("click", function f() {
            that.ruchGracz(that)
            this.remove()
        }, false)
    },
    statekWypelnijGracz: function (x, y) {
        if ((this.cmp2[x][y] == 0) || (this.cmp2[x][y] == 2)) return
        if (this.wypelnijPolaGracz[x][y] == 3) return
        if ((this.cmp2[x][y] == 3) || (this.cmp2[x][y] == 1)) this.wypelnijPolaGracz[x][y] = 3
        this.statekWypelnijGracz(x, y - 1)
        this.statekWypelnijGracz(x + 1, y)
        this.statekWypelnijGracz(x, y + 1)
        this.statekWypelnijGracz(x - 1, y)
    },
    czyZatopionyGracz: function () {
        var licznik1 = 0
        var licznik2 = 0
        for (var i = 0; i < 12; i++) {
            for (var j = 0; j < 12; j++) {
                if (this.wypelnijPolaGracz[i][j] == 3) licznik1++
                if ((this.wypelnijPolaGracz[i][j] == 3) && (this.cmp2[i][j] == 3)) licznik2++
            }
        }
        for (var i = 0; i < 12; i++) {
            for (var j = 0; j < 12; j++) {
                if ((licznik1 == licznik2) && (this.wypelnijPolaGracz[i][j] == 3)) this.cmp[i][j].classList.add("zatopiony")
                this.wypelnijPolaGracz[i][j] = 0
            }
        }
    },
    statekWypelnijKomputer: function (x, y) {
        if ((this.player2[x][y] == 0) || (this.player2[x][y] == 2)) return
        if (this.wypelnijPolaKomputer[x][y] == 3) return
        if ((this.player2[x][y] == 3) || (this.player2[x][y] == 1)) this.wypelnijPolaKomputer[x][y] = 3
        this.statekWypelnijKomputer(x, y - 1)
        this.statekWypelnijKomputer(x + 1, y)
        this.statekWypelnijKomputer(x, y + 1)
        this.statekWypelnijKomputer(x - 1, y)
    },
    czyZatopionyKomputer: function () {
        var licznik1 = 0
        var licznik2 = 0
        for (var i = 0; i < 12; i++) {
            for (var j = 0; j < 12; j++) {
                if (this.wypelnijPolaKomputer[i][j] == 3) licznik1++
                if ((this.wypelnijPolaKomputer[i][j] == 3) && (this.player2[i][j] == 3)) licznik2++
            }
        }
        if (licznik1 == licznik2) {
            for (var i = 0; i < 12; i++) {
                for (var j = 0; j < 12; j++) {
                    if (this.wypelnijPolaKomputer[i][j] == 3) {
                        this.player[i][j].classList.add("zatopiony")
                        for (var k = i - 1; k < i + 2; k++) {
                            for (var l = j - 1; l < j + 2; l++) {
                                if (this.player2[k][l] == 0) this.player2[k][l] = 2
                            }
                        }
                    } this.wypelnijPolaKomputer[i][j] = 0
                }
            }
            for (var i = 0; i < this.maszty.length; i++) {
                if (this.maszty[i] == licznik1) {
                    this.maszty.splice(i, 1)
                    break
                }
            }
            this.inteligencjaNajdluzszy = this.maszty[0]
            return true
        }
        else return false
    },
    ruchGracz: function (that) {
        for (let i = 1; i < 11; i++) {
            for (let j = 1; j < 11; j++) {
                if ((that.cmp2[i][j] == 2) || (that.cmp2[i][j] == 3)) {
                    that.cmp[i][j].onclick = null
                } else {
                    that.cmp[i][j].onclick = function () {
                        if (that.cmp2[i][j]) {
                            this.classList.add("x")
                            that.doTrafieniaGracz--
                            that.cmp2[i][j] = 3
                            that.statekWypelnijGracz(i, j)
                            that.czyZatopionyGracz()
                        } else {
                            this.classList.add("dot")
                            that.cmp2[i][j] = 2
                        }
                        if (that.doTrafieniaGracz == 0) return that.koniecGry(true)
                        that.ruchKomputer()
                    }
                }
            }
        }
    },
    ruchKomputer: function () {
        var that = this
        for (let i = 1; i < 11; i++) {
            for (let j = 1; j < 11; j++) {
                that.cmp[i][j].onclick = function () {
                    alert("Ruch komputera")
                }
            }
        }
        function sprawdz(x, y) {
            that.dobijaniePoprzedniPunkt = that.player2[x][y]
            if ((that.player2[x][y] == 2) || (that.player2[x][y] == 3)) {
                return strzal()
            } else if (that.player2[x][y] == 1) {
                that.player[x][y].classList.add("x")
                that.doTrafieniaKomputer--
                that.player2[x][y] = 3
                that.statekWypelnijKomputer(x, y)
                if (that.czyZatopionyKomputer(true)) var czyZatopiony = true
                else var czyZatopiony = false
                if (czyZatopiony) {
                    that.dobijanie = false
                }
                if (that.dobijanie) {
                    that.dobijanieMnoznik++
                    that.dobijanieKierunekPoprawny = true
                }
                if ((!that.dobijanie) && (!czyZatopiony)) {
                    that.dobijanie = true
                    that.dobijanieMnoznik = 1
                    that.dobijanieKierunek = 0
                    that.dobijanieKierunekPoprawny = false
                    that.dobijanieX = x
                    that.dobijanieY = y
                }
            } else {
                that.dobijanieKierunek++
                that.player[x][y].classList.add("dot")
                that.player2[x][y] = 2
            }
            if (that.doTrafieniaKomputer == 0) return that.koniecGry(false)
            that.ruchGracz(that)
        }
        function dobij() {
            if ((that.dobijaniePoprzedniPunkt == 0) && (that.dobijanieKierunekPoprawny)) {
                that.dobijanieKierunek++
                that.dobijanieMnoznik = 1
            }
            if ((that.dobijanieX + that.dobijanieMnoznik < 11) && (that.dobijanieKierunek % 4 == 0) && (that.player2[that.dobijanieX + that.dobijanieMnoznik][that.dobijanieY] != 2)) sprawdz(that.dobijanieX + that.dobijanieMnoznik, that.dobijanieY)
            else if ((that.dobijanieY + that.dobijanieMnoznik < 11) && (that.dobijanieKierunek % 4 == 1) && (that.player2[that.dobijanieX][that.dobijanieY + that.dobijanieMnoznik] != 2)) sprawdz(that.dobijanieX, that.dobijanieY + that.dobijanieMnoznik)
            else if ((that.dobijanieX - that.dobijanieMnoznik > 0) && (that.dobijanieKierunek % 4 == 2) && (that.player2[that.dobijanieX - that.dobijanieMnoznik][that.dobijanieY] != 2)) sprawdz(that.dobijanieX - that.dobijanieMnoznik, that.dobijanieY)
            else if ((that.dobijanieY - that.dobijanieMnoznik > 0) && (that.dobijanieKierunek % 4 == 3) && (that.player2[that.dobijanieX][that.dobijanieY - that.dobijanieMnoznik] != 2)) sprawdz(that.dobijanieX, that.dobijanieY - that.dobijanieMnoznik)
            else if (that.dobijanieKierunekPoprawny) {
                that.dobijanieKierunek += 2
                that.dobijanieMnoznik = 1
                return dobij()
            } else {
                that.dobijanieKierunek++
                return dobij()
            }
            that.ruchGracz(that)
        }
        function strzal() {
            if (that.dobijanie) {
                dobij()
            } else {
                var wynik = that.policzNajlepsze()
                sprawdz(wynik[0], wynik[1])
            }
        }
        setTimeout(strzal, 1000)
    },
    policzNajlepsze: function () {
        var najlepsze = 0
        var najlepszePola = []
        var zmiesciSie = false
        for (var i = 1; i < 11; i++) {
            for (var j = 1; j < 11; j++) {
                this.inteligencjaPola[i][j] = 0
            }
        }
        for (var i = 1; i < 11; i++) {
            for (var j = 1; j < 11; j++) {
                if (i + this.inteligencjaNajdluzszy < 12) {
                    zmiesciSie = true
                    for (var k = 0; k < this.inteligencjaNajdluzszy; k++) {
                        if ((this.player2[i + k][j] == 2) || (this.player2[i + k][j] == 3)) zmiesciSie = false
                    }
                    if (zmiesciSie) {
                        for (var k = 0; k < this.inteligencjaNajdluzszy; k++) {
                            this.inteligencjaPola[i + k][j] += 1
                        }
                    }
                }
                if (j + this.inteligencjaNajdluzszy < 12) {
                    zmiesciSie = true
                    for (var k = 0; k < this.inteligencjaNajdluzszy; k++) {
                        if ((this.player2[i][j + k] == 2) || (this.player2[i][j + k] == 3)) zmiesciSie = false
                    }
                    if (zmiesciSie) {
                        for (var k = 0; k < this.inteligencjaNajdluzszy; k++) {
                            this.inteligencjaPola[i][j + k] += 1
                        }
                    }
                }
            }
        }
        for (var i = 1; i < 11; i++) {
            for (var j = 1; j < 11; j++) {
                if (this.inteligencjaPola[i][j] > najlepsze) {
                    najlepsze = this.inteligencjaPola[i][j]
                    najlepszePola = []
                }
                if (this.inteligencjaPola[i][j] == najlepsze) {
                    najlepszePola.push([i, j])
                }
            }
        }
        return najlepszePola[Math.floor(Math.random() * najlepszePola.length)]
    },
    koniecGry: function (ktoWygral) {
        for (let i = 1; i < 11; i++) {
            for (let j = 1; j < 11; j++) {
                this.cmp[i][j].onclick = null
            }
        }
        if (ktoWygral) alert("Koniec gry. Wygrał Gracz!")
        else alert("Koniec gry. Wygrał Komputer!")
        var przyciskKoniec = document.createElement("button")
        przyciskKoniec.innerHTML = "ZAGRAJ JESZCZE RAZ"
        document.body.appendChild(przyciskKoniec)
        przyciskKoniec.onclick = function () { location.reload() }
    }
};

statki.start()
