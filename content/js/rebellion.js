$(document).ready(function ()
{
    PRESETUP.Execute();
    LIGHTSABER.Setup();

    if (OPTIONS.IsMobile())
        $("footer").addClass("hide-on-mobile");
});

var OPTIONS =
{
    BLUE_TRIANGLE: 1,
    BLUE_SQUARE: 2,
    BLUE_CIRCLE: 3,
    YELLOW_TRIANGLE: 4,
    YELLOW_SQUARE: 5,
    YELLOW_CIRCLE: 6,

    IsMobile: function ()
    {
        return /Mobi|Android/i.test(navigator.userAgent);
	}
};

var PRESETUP =
{
    STORAGE_KEY: "SWRBQ",
    STORAGE_KEY_OPTIONS: "SWRBQO",
    PROMPT_CONTINUE: true,

    Execute: function ()
    {
        var _this = this;

        _this.SetupKofi();
        _this.LoadOptions();
        _this.SetupConfirm();
        _this.SetupPrevious();
    },

    SetupKofi: function()
    {
        if (!OPTIONS.IsMobile())
        {
            kofiWidgetOverlay.draw('zinned', {
                'type': 'floating-chat',
                'floating-chat.donateButton.text': 'Support me',
                'floating-chat.donateButton.background-color': '#fcbf47',
                'floating-chat.donateButton.text-color': '#323842'
              });
        }
    },

    LoadOptions: function ()
    {
        var _this = this;

        var options = localStorage.getItem(PRESETUP.STORAGE_KEY_OPTIONS);
        if (options !== null)
        {
            var xoptions = JSON.parse(options);
            REBELLION.SKIPCONFIRM = xoptions.prompt === undefined ? false : !xoptions.prompt;
            REBELLION.OVERRIDE    = xoptions.override === undefined ? false : xoptions.override;
            _this.PROMPT_CONTINUE = xoptions.continue === undefined ? true : xoptions.continue;

            $("#prompt").prop("checked", xoptions.prompt);
            $("#override").prop("checked", xoptions.override);
            $("#promptc").prop("checked", xoptions.continue);
        }
	},

    SetupPrevious: function()
    {
        var _this = this;

        var stored = localStorage.getItem(PRESETUP.STORAGE_KEY);
        if (stored !== null)
        {
            $("#sccontinue").on("click", function () { REBELLION.CloseMenu($("#continue")); REBELLION.Setup(JSON.parse(stored)); });
            $("#screset").on("click", function () { REBELLION.CloseMenu($("#continue")); REBELLION.Setup(null); });

            if (!_this.PROMPT_CONTINUE)
                REBELLION.Setup(JSON.parse(stored));
            else
                REBELLION.OpenMenu($("#continue"));
        }
        else
            REBELLION.Setup(null);
	},

    SetupConfirm: function()
	{
        $("#resetyes").on("click", function () { REBELLION.CloseAllMenus(); REBELLION.ResetMapConfirmed(); });
        $("#resetno").on("click", function () { REBELLION.CloseAllMenus(); });
	}
};

var REBELLION =
{
    PATHS: [],
    TAPSTART: 0,
    TAPEND: new Date().getTime(),
    TAPTO: null,
    OVERRIDE: false,
    SKIPCONFIRM: false,

    SYSTEMS:
        [
            { Name: "Utapau", Loyalty: 0, ProbingAllowed: true, Probed: 0, BuildQueue: 3, Option1: OPTIONS.BLUE_CIRCLE, Option2: OPTIONS.BLUE_SQUARE, IsBuildingAllowed: true, IsRemoteSystem: false },
            { Name: "Toydaria", Loyalty: 0, ProbingAllowed: true, Probed: 0, BuildQueue: 2, Option1: OPTIONS.BLUE_CIRCLE, Option2: null, IsBuildingAllowed: true, IsRemoteSystem: false },
            { Name: "Sullust", Loyalty: 0, ProbingAllowed: true, Probed: 0, BuildQueue: 2, Option1: OPTIONS.YELLOW_TRIANGLE, Option2: OPTIONS.YELLOW_SQUARE, IsBuildingAllowed: true, IsRemoteSystem: false },
            { Name: "Saleucami", Loyalty: 0, ProbingAllowed: true, Probed: 0, BuildQueue: 1, Option1: OPTIONS.YELLOW_CIRCLE, Option2: null, IsBuildingAllowed: true, IsRemoteSystem: false },
            { Name: "Ryloth", Loyalty: 0, ProbingAllowed: true, Probed: 0, BuildQueue: 1, Option1: OPTIONS.YELLOW_TRIANGLE, Option2: null, IsBuildingAllowed: true, IsRemoteSystem: false },
            { Name: "Rodia", Loyalty: 0, ProbingAllowed: true, Probed: 0, BuildQueue: 1, Option1: OPTIONS.YELLOW_TRIANGLE, Option2: null, IsBuildingAllowed: true, IsRemoteSystem: false },
            { Name: "OrdMantell", Loyalty: 0, ProbingAllowed: true, Probed: 0, BuildQueue: 2, Option1: OPTIONS.BLUE_CIRCLE, Option2: OPTIONS.YELLOW_CIRCLE, IsBuildingAllowed: true, IsRemoteSystem: false },
            { Name: "NalHutta", Loyalty: 0, ProbingAllowed: true, Probed: 0, BuildQueue: 1, Option1: OPTIONS.YELLOW_TRIANGLE, Option2: OPTIONS.BLUE_TRIANGLE, IsBuildingAllowed: true, IsRemoteSystem: false },
            { Name: "Naboo", Loyalty: 0, ProbingAllowed: true, Probed: 0, BuildQueue: 1, Option1: OPTIONS.YELLOW_TRIANGLE, Option2: OPTIONS.BLUE_TRIANGLE, IsBuildingAllowed: true, IsRemoteSystem: false },
            { Name: "Mygeeto", Loyalty: 0, ProbingAllowed: true, Probed: 0, BuildQueue: 2, Option1: OPTIONS.BLUE_TRIANGLE, Option2: OPTIONS.YELLOW_SQUARE, IsBuildingAllowed: true, IsRemoteSystem: false },
            { Name: "Mustafar", Loyalty: 0, ProbingAllowed: true, Probed: 0, BuildQueue: 2, Option1: OPTIONS.BLUE_TRIANGLE, Option2: OPTIONS.BLUE_CIRCLE, IsBuildingAllowed: true, IsRemoteSystem: false },
            { Name: "MonCalamari", Loyalty: 0, ProbingAllowed: true, Probed: 0, BuildQueue: 3, Option1: OPTIONS.BLUE_TRIANGLE, Option2: OPTIONS.BLUE_SQUARE, IsBuildingAllowed: true, IsRemoteSystem: false },
            { Name: "Mandalore", Loyalty: 0, ProbingAllowed: true, Probed: 0, BuildQueue: 1, Option1: OPTIONS.YELLOW_TRIANGLE, Option2: OPTIONS.BLUE_TRIANGLE, IsBuildingAllowed: true, IsRemoteSystem: false },
            { Name: "Malastare", Loyalty: 0, ProbingAllowed: true, Probed: 0, BuildQueue: 1, Option1: OPTIONS.YELLOW_TRIANGLE, Option2: null, IsBuildingAllowed: true, IsRemoteSystem: false },
            { Name: "Kessel", Loyalty: 0, ProbingAllowed: true, Probed: 0, BuildQueue: 1, Option1: OPTIONS.YELLOW_TRIANGLE, Option2: null, IsBuildingAllowed: true, IsRemoteSystem: false },
            { Name: "Kashyyyk", Loyalty: 0, ProbingAllowed: true, Probed: 0, BuildQueue: 1, Option1: OPTIONS.YELLOW_TRIANGLE, Option2: OPTIONS.YELLOW_TRIANGLE, IsBuildingAllowed: true, IsRemoteSystem: false },
            { Name: "Geonosis", Loyalty: 0, ProbingAllowed: true, Probed: 0, BuildQueue: 2, Option1: OPTIONS.BLUE_TRIANGLE, Option2: OPTIONS.YELLOW_SQUARE, IsBuildingAllowed: true, IsRemoteSystem: false },
            { Name: "Felucia", Loyalty: 0, ProbingAllowed: true, Probed: 0, BuildQueue: 1, Option1: OPTIONS.YELLOW_TRIANGLE, Option2: null, IsBuildingAllowed: true, IsRemoteSystem: false },
            { Name: "Corellia", Loyalty: 0, ProbingAllowed: true, Probed: 0, BuildQueue: 3, Option1: OPTIONS.BLUE_TRIANGLE, Option2: OPTIONS.BLUE_SQUARE, IsBuildingAllowed: true, IsRemoteSystem: false },
            { Name: "CatoNeimoidia", Loyalty: 0, ProbingAllowed: true, Probed: 0, BuildQueue: 2, Option1: OPTIONS.BLUE_TRIANGLE, Option2: OPTIONS.YELLOW_CIRCLE, IsBuildingAllowed: true, IsRemoteSystem: false },
            { Name: "Bothawui", Loyalty: 0, ProbingAllowed: true, Probed: 0, BuildQueue: 1, Option1: OPTIONS.YELLOW_CIRCLE, Option2: null, IsBuildingAllowed: true, IsRemoteSystem: false },
            { Name: "Bespin", Loyalty: 0, ProbingAllowed: true, Probed: 0, BuildQueue: 1, Option1: OPTIONS.YELLOW_CIRCLE, Option2: null, IsBuildingAllowed: true, IsRemoteSystem: false },
            { Name: "Alderaan", Loyalty: 0, ProbingAllowed: true, Probed: 0, BuildQueue: 1, Option1: OPTIONS.YELLOW_TRIANGLE, Option2: null, IsBuildingAllowed: true, IsRemoteSystem: false },
            { Name: "Coruscant", Loyalty: 2, ProbingAllowed: false, BuildQueue: 1, Option1: OPTIONS.YELLOW_TRIANGLE, Option2: null, IsBuildingAllowed: true, IsRemoteSystem: false },
            { Name: "RebelBase", Loyalty: 3, ProbingAllowed: false, BuildQueue: 1, Option1: OPTIONS.BLUE_TRIANGLE, Option2: OPTIONS.YELLOW_TRIANGLE, IsBuildingAllowed: true, IsRemoteSystem: false },
            { Name: "Yavin", Loyalty: 0, ProbingAllowed: true, Probed: 0, BuildQueue: 0, Option1: 0, Option2: 0, IsBuildingAllowed: false, IsRemoteSystem: true },
            { Name: "Dathomir", Loyalty: 0, ProbingAllowed: true, Probed: 0, BuildQueue: 0, Option1: 0, Option2: 0, IsBuildingAllowed: false, IsRemoteSystem: true },
            { Name: "Dantooine", Loyalty: 0, ProbingAllowed: true, Probed: 0, BuildQueue: 0, Option1: 0, Option2: 0, IsBuildingAllowed: false, IsRemoteSystem: true },
            { Name: "Ilum", Loyalty: 0, ProbingAllowed: true, Probed: 0, BuildQueue: 0, Option1: 0, Option2: 0, IsBuildingAllowed: false, IsRemoteSystem: true },
            { Name: "Tatooine", Loyalty: 0, ProbingAllowed: true, Probed: 0, BuildQueue: 0, Option1: 0, Option2: 0, IsBuildingAllowed: false, IsRemoteSystem: true },
            { Name: "Dagobah", Loyalty: 0, ProbingAllowed: true, Probed: 0, BuildQueue: 0, Option1: 0, Option2: 0, IsBuildingAllowed: false, IsRemoteSystem: true },
            { Name: "Hoth", Loyalty: 0, ProbingAllowed: true, Probed: 0, BuildQueue: 0, Option1: 0, Option2: 0, IsBuildingAllowed: false, IsRemoteSystem: true },
            { Name: "Endor", Loyalty: 0, ProbingAllowed: true, Probed: 0, BuildQueue: 0, Option1: 0, Option2: 0, IsBuildingAllowed: false, IsRemoteSystem: true }
        ],

    Setup: function (previous)
    {
        var _this = this;
        var svg = Snap("#mysvg");         // WRAP SVG <svg id="mysvg"> (prep svg for snap svg library to use)
        var sys = svg.select("#Buttons"); // SELECT the nested element <path id="Buttons">

        _this.PATHS = sys.children();         // SELECT all the children of the buttons group

        $("#resetmap").css("opacity", 1).on("click", function () { _this.CloseAllMenus(); _this.ResetMap(_this.SKIPCONFIRM); });
        $("#buildqueue").css("opacity", 1).on("click", function () { _this.SetBQ(); _this.OpenMenu($("#bqmenu")); });
        $("#options").css("opacity", 1).on("click", function () { _this.OpenMenu($("#optionsmenu")); });
        $("#about").css("opacity", 1).on("click", function () { _this.OpenMenu($("#aboutmenu")); });
        //$("#donate").css("opacity", 1).on("click", function () { _this.OpenMenu($("#donatemenu")); });
        $("#hotkeys").css("opacity", 1).on("click", function () { _this.OpenMenu($("#hotkeysmenu")); });

        $("#closemainmenu").css("opacity", 1).on("click", function () { _this.CloseMenu($("#mainmenu")); });
        $("#closebqmenu").css("opacity", 1).on("click", function () { _this.CloseMenu($("#bqmenu")); });
        $("#closeaboutmenu").css("opacity", 1).on("click", function () { _this.CloseMenu($("#aboutmenu")); });
        //$("#closedonatemenu").css("opacity", 1).on("click", function () { _this.CloseMenu($("#donatemenu")); });
        $("#closehotkeysmenu").css("opacity", 1).on("click", function () { _this.CloseMenu($("#hotkeysmenu")); });
        $("#closeoptionsmenu").css("opacity", 1).on("click", function () { _this.CloseMenu($("#optionsmenu")); });

        svg.select("#mainmenu").click(function () { _this.OpenMenu($("#mainmenu")); });
        svg.select("#buildqueuebutton").click(function () { _this.SetBQ(); _this.OpenMenu($("#bqmenu")); });
        svg.select("#flipbutton").click(function () { _this.FlipBoard(); });
        svg.select("#droidbutton").click(function () { _this.ToggleDroid(); });

        svg.select("#show-rebels-bq").click(function () { $("#show-rebels").add($("#rebels")).addClass("active"); $("#show-empire").add($("#empire")).removeClass("active"); _this.SetBQ(); _this.OpenMenu($("#bqmenu")); });
        svg.select("#show-empire-bq").click(function () { $("#show-empire").add($("#empire")).addClass("active"); $("#show-rebels").add($("#rebels")).removeClass("active"); _this.SetBQ(); _this.OpenMenu($("#bqmenu")); });

        _this.SetupPaths(svg.select("#Coruscant"), svg.select("#rebelbase"));
        if (previous === null)
            _this.ResetMap(true);
        else
            _this.LoadPrevious(previous);
        _this.SetupFactions();
        _this.SetupToggleKeys();
    },

    SetupToggleKeys: function ()
    {
        var _this = this;

        $(document).on("keyup", function (e)
        {
            var key = e.keyCode || e.which || e.charCode || e.key;
            switch (key)
            {
                case 66: // b
                    _this.SetBQ();
                    _this.OpenMenu($("#bqmenu"));
                    break;
                case 77: // m
                    _this.OpenMenu($("#mainmenu"));
                    break;
                case 82: // r
                    _this.CloseAllMenus();
                    _this.ResetMap(_this.SKIPCONFIRM);
                    break;
                case 65: // a
                    _this.OpenMenu($("#aboutmenu"));
                    break;
                //case 68: // d
                //    _this.OpenMenu($("#donatemenu"));
                //    break;
                case 72: // h
                    _this.OpenMenu($("#hotkeysmenu"));
                    break;
                case 79: // o
                    _this.OpenMenu($("#optionsmenu"));
                    break;
                case 70: // f
                    _this.FlipBoard();
                    break;
                case 80: // p
                    _this.ToggleDroid();
                    break;
                case 27: // ESC
                    _this.CloseAllMenus();
                    break;
                case 38: // UP KEY
                    break;
                case 40: // DOWN KEY
                    break;
                case 37: // LEFT KEY
                    break;
                case 39: // RIGHT KEY
                    break;
            }
        });
    },

    LoadPrevious: function (previous)
    {
        var _this = this;

        _this.SYSTEMS = previous;
        _this.PATHS.forEach(function (elem)
        {
            if (elem.type === "g")
            {
                var system = _this.SYSTEMS.find(x => x.Name === elem.attr("id"));
                if (system !== undefined)
                {
                    _this.StyleSystem(elem, system);
                    _this.StyleProbes(elem, system);
				}
            }
        });

        var coruscant = _this.SYSTEMS.find(x => x.Name === "Coruscant");
        var rebelbase = _this.SYSTEMS.find(x => x.Name === "RebelBase");
        var svg = Snap("#mysvg");
        _this.ToggleBuildAllowed(svg.select("#Coruscant"), coruscant);
        _this.ToggleBuildAllowed(svg.select("#rebelbase"), rebelbase);
    },

    SetupPaths: function (coruscant, rebelbase)
    {
        var _this = this;

        _this.PATHS.forEach(function (elem)
        {
            if (elem.type === "g")
            {
                if (_this.IsTouchDevice() || _this.OVERRIDE)
                {
                    elem.touchstart(touchStart);
                    elem.touchend(touchEnd);
                }
                else
                    elem.mousedown(toggleSystem);
            }

            function toggleSystem(e)
            {
                var system = _this.SYSTEMS.find(x => x.Name === elem.attr("id"));

                if ($(".space").hasClass("droid"))
                {
                    if (system !== undefined && system.ProbingAllowed)
                    {
                        system.Probed++;
                        if ((system.IsRemoteSystem && system.Probed === 3) || (!system.IsRemoteSystem && system.Probed === 2)) // ONLY ALLOW 'BOOTS ON THE GROUND' STATUS ON REMOTE SYSTEMS
                            system.Probed = 0;

                        _this.StyleProbes(elem, system);
					}
				}
                else
                {
                    if (system !== undefined && !system.IsRemoteSystem)
                    {
                        if (e.button === 0) // LEFT CLICK, TOGGLE BETWEEN LOYALTIES
                        {
                            system.Loyalty++;
                            if (system.Loyalty === 4)
                                system.Loyalty = 0;

                            system.IsBuildingAllowed = true; // RESET BUILDING ALLOWED WHEN CHANGING LOYALTY
                        }
                        else if ((e.button === 2) && system.Loyalty !== 0) // RIGHT CLICK, TOGGLE BETWEEN BUILDING ALLOWED STATES WHEN SYSTEM HAS LOYALTY
                            system.IsBuildingAllowed = !system.IsBuildingAllowed;

                        _this.StyleSystem(elem, system);
                    }
				}
            }
            function touchStart()
            {
                _this.TAPSTART = new Date().getTime();
            }
            function touchEnd()
            {
                var e = { button: 0 };
                var now = new Date().getTime();
                if (now - _this.TAPSTART >= 500) // LONG TAP => TOGGLE BUILD ALLOWED STATUS
                    e.button = 2;
                if (now - _this.TAPEND < 200) // DOUBLE TAP
                {
                    e.button = 2;
                    clearTimeout(_this.TAPTO);
                    _this.TAPTO = null;
				}

                _this.TAPEND = now;
                _this.TAPTO = setTimeout(function ()
                {
                    toggleSystem(e);
                }, 200);
            }
        });

        if (_this.IsTouchDevice())
        {
            coruscant.touchend(toggleSystemCoruscant);
            rebelbase.touchend(toggleSystemRebelBase);
        }
        else
        {
            coruscant.mousedown(toggleSystemCoruscant);
            rebelbase.mousedown(toggleSystemRebelBase);
        }

        function toggleSystemCoruscant(e)
        {
            toggleSystem(e, "Coruscant", coruscant);
        }
        function toggleSystemRebelBase(e)
        {
            toggleSystem(e, "RebelBase", rebelbase);
        }
        function toggleSystem(e, name, elem)
        {
            var system = _this.SYSTEMS.find(x => x.Name === name);

            if (!$(".space").hasClass("droid"))
            {
                if (system !== undefined && !system.IsRemoteSystem)
                {
                    if (system.Loyalty !== 0) // RIGHT CLICK, TOGGLE BETWEEN BUILDING ALLOWED STATES WHEN SYSTEM HAS LOYALTY
                        system.IsBuildingAllowed = !system.IsBuildingAllowed;

                    _this.ToggleBuildAllowed(elem, system);
                }
			}
        }
    },

    ToggleBuildAllowed: function (elem, system)
    {
        var _this = this;

        elem.toggleClass("bq-disallowed", !system.IsBuildingAllowed);

        localStorage.setItem(PRESETUP.STORAGE_KEY, JSON.stringify(_this.SYSTEMS));
    },

    StyleSystem: function (elem, system)
    {
        var _this = this;

        elem.removeClass("bq-impsub bq-rebel bq-imploy");

		switch (system.Loyalty)
        {
            case 1:
                elem.addClass("bq-impsub");
                break;
            case 2:
                elem.addClass("bq-imploy");
                break;
            case 3:
                elem.addClass("bq-rebel");
                break;
        }
        elem.toggleClass("bq-disallowed", !system.IsBuildingAllowed);

        localStorage.setItem(PRESETUP.STORAGE_KEY, JSON.stringify(_this.SYSTEMS));
    },

    StyleProbes: function (elem, system)
    {
        var _this = this;

        elem.removeClass("bq-droid bq-boots");

        switch (system.Probed)
        {
            case 1:
                elem.addClass("bq-droid");
                break;
            case 2:
                elem.addClass("bq-boots");
                break;
            default:
        }

        localStorage.setItem(PRESETUP.STORAGE_KEY, JSON.stringify(_this.SYSTEMS));
	},

    ResetMap: function(skipconfirm)
	{
        var _this = this;

        if (skipconfirm)
            _this.ResetMapConfirmed();
        else
            _this.OpenMenu($("#confirmreset"));
	},

    ResetMapConfirmed: function ()
    {
        var _this = this;

        _this.PATHS.forEach(function (elem)
        {
            if (elem.type === "g")
            {
                var system = _this.SYSTEMS.find(x => x.Name === elem.attr("id"));
                if (system !== undefined)
                {
                    system.Loyalty            = 0;
                    system.Probed             = 0;
                    system.IsBuildingAllowed  = true;

                    elem.removeClass("bq-droid");
                    elem.removeClass("bq-boots");

                    _this.StyleSystem(elem, system);
                }
            }
        });

        var coruscant = _this.SYSTEMS.find(x => x.Name === "Coruscant");
        var rebelbase = _this.SYSTEMS.find(x => x.Name === "RebelBase");

        coruscant.Loyalty = 2;
        coruscant.IsBuildingAllowed = true;
        rebelbase.Loyalty = 3;
        rebelbase.IsBuildingAllowed = true;

        var svg = Snap("#mysvg");
        _this.ToggleBuildAllowed(svg.select("#Coruscant"), coruscant);
        _this.ToggleBuildAllowed(svg.select("#rebelbase"), rebelbase);

        localStorage.removeItem(PRESETUP.STORAGE_KEY);
    },

    OpenMenu: function ($menu)
    {
        $menu.css("opacity", 1).css("visibility", "visible");
    },

    CloseMenu: function ($menu)
    {
        $menu.css("opacity", 0).css("visibility", "hidden");

        if ($menu.attr("id") === "optionsmenu" && LIGHTSABER.OVERRIDE_CHANGED)
            location.reload();
    },

    CloseAllMenus: function ()
    {
        var _this = this;

        _this.CloseMenu($("#mainmenu"));
        _this.CloseMenu($("#bqmenu"));
        _this.CloseMenu($("#aboutmenu"));
        //_this.CloseMenu($("#donatemenu"));
        _this.CloseMenu($("#hotkeysmenu"));
        _this.CloseMenu($("#confirmreset"));
        _this.CloseMenu($("#optionsmenu"));
    },

    FlipBoard: function ()
    {
        $("#flippable").toggleClass("flip");
    },

    ToggleDroid: function ()
    {
        $("#droidbutton").toggleClass("active");
        $(".space").toggleClass("droid");
	},

    SetupFactions: function ()
    {
        $("#bq-factions .button").on("click", function ()
        {
            var $this = $(this);

            $("#bq-factions .button").removeClass("active");
            $("#bq-factions .tab").removeClass("active");
            $this.addClass("active");
            $($this.data("show")).addClass("active");
        });
    },

    SetBQ: function ()
    {
        var _this = this;

        var subq1 = _this.SYSTEMS.filter(x => x.Loyalty === 1 && x.BuildQueue === 1 && x.IsBuildingAllowed === true);
        var subq2 = _this.SYSTEMS.filter(x => x.Loyalty === 1 && x.BuildQueue === 2 && x.IsBuildingAllowed === true);
        var subq3 = _this.SYSTEMS.filter(x => x.Loyalty === 1 && x.BuildQueue === 3 && x.IsBuildingAllowed === true);
        var empq1 = _this.SYSTEMS.filter(x => x.Loyalty === 2 && x.BuildQueue === 1 && x.IsBuildingAllowed === true);
        var empq2 = _this.SYSTEMS.filter(x => x.Loyalty === 2 && x.BuildQueue === 2 && x.IsBuildingAllowed === true);
        var empq3 = _this.SYSTEMS.filter(x => x.Loyalty === 2 && x.BuildQueue === 3 && x.IsBuildingAllowed === true);
        var rebq1 = _this.SYSTEMS.filter(x => x.Loyalty === 3 && x.BuildQueue === 1 && x.IsBuildingAllowed === true);
        var rebq2 = _this.SYSTEMS.filter(x => x.Loyalty === 3 && x.BuildQueue === 2 && x.IsBuildingAllowed === true);
        var rebq3 = _this.SYSTEMS.filter(x => x.Loyalty === 3 && x.BuildQueue === 3 && x.IsBuildingAllowed === true);

        var empire =
        {
            Q1:
            {
                BlueCircles: subq1.filter(x => x.Option1 === OPTIONS.BLUE_CIRCLE).length + empq1.filter(x => x.Option1 === OPTIONS.BLUE_CIRCLE).length + empq1.filter(x => x.Option2 === OPTIONS.BLUE_CIRCLE).length,
                BlueSquares: subq1.filter(x => x.Option1 === OPTIONS.BLUE_SQUARE).length + empq1.filter(x => x.Option1 === OPTIONS.BLUE_SQUARE).length + empq1.filter(x => x.Option2 === OPTIONS.BLUE_SQUARE).length,
                BlueTriangles: subq1.filter(x => x.Option1 === OPTIONS.BLUE_TRIANGLE).length + empq1.filter(x => x.Option1 === OPTIONS.BLUE_TRIANGLE).length + empq1.filter(x => x.Option2 === OPTIONS.BLUE_TRIANGLE).length,
                YellowCircles: subq1.filter(x => x.Option1 === OPTIONS.YELLOW_CIRCLE).length + empq1.filter(x => x.Option1 === OPTIONS.YELLOW_CIRCLE).length + empq1.filter(x => x.Option2 === OPTIONS.YELLOW_CIRCLE).length,
                YellowSquares: subq1.filter(x => x.Option1 === OPTIONS.YELLOW_SQUARE).length + empq1.filter(x => x.Option1 === OPTIONS.YELLOW_SQUARE).length + empq1.filter(x => x.Option2 === OPTIONS.YELLOW_SQUARE).length,
                YellowTriangles: subq1.filter(x => x.Option1 === OPTIONS.YELLOW_TRIANGLE).length + empq1.filter(x => x.Option1 === OPTIONS.YELLOW_TRIANGLE).length + empq1.filter(x => x.Option2 === OPTIONS.YELLOW_TRIANGLE).length
            },
            Q2:
            {
                BlueCircles: subq2.filter(x => x.Option1 === OPTIONS.BLUE_CIRCLE).length + empq2.filter(x => x.Option1 === OPTIONS.BLUE_CIRCLE).length + empq2.filter(x => x.Option2 === OPTIONS.BLUE_CIRCLE).length,
                BlueSquares: subq2.filter(x => x.Option1 === OPTIONS.BLUE_SQUARE).length + empq2.filter(x => x.Option1 === OPTIONS.BLUE_SQUARE).length + empq2.filter(x => x.Option2 === OPTIONS.BLUE_SQUARE).length,
                BlueTriangles: subq2.filter(x => x.Option1 === OPTIONS.BLUE_TRIANGLE).length + empq2.filter(x => x.Option1 === OPTIONS.BLUE_TRIANGLE).length + empq2.filter(x => x.Option2 === OPTIONS.BLUE_TRIANGLE).length,
                YellowCircles: subq2.filter(x => x.Option1 === OPTIONS.YELLOW_CIRCLE).length + empq2.filter(x => x.Option1 === OPTIONS.YELLOW_CIRCLE).length + empq2.filter(x => x.Option2 === OPTIONS.YELLOW_CIRCLE).length,
                YellowSquares: subq2.filter(x => x.Option1 === OPTIONS.YELLOW_SQUARE).length + empq2.filter(x => x.Option1 === OPTIONS.YELLOW_SQUARE).length + empq2.filter(x => x.Option2 === OPTIONS.YELLOW_SQUARE).length,
                YellowTriangles: subq2.filter(x => x.Option1 === OPTIONS.YELLOW_TRIANGLE).length + empq2.filter(x => x.Option1 === OPTIONS.YELLOW_TRIANGLE).length + empq2.filter(x => x.Option2 === OPTIONS.YELLOW_TRIANGLE).length
            },
            Q3:
            {
                BlueCircles: subq3.filter(x => x.Option1 === OPTIONS.BLUE_CIRCLE).length + empq3.filter(x => x.Option1 === OPTIONS.BLUE_CIRCLE).length + empq3.filter(x => x.Option2 === OPTIONS.BLUE_CIRCLE).length,
                BlueSquares: subq3.filter(x => x.Option1 === OPTIONS.BLUE_SQUARE).length + empq3.filter(x => x.Option1 === OPTIONS.BLUE_SQUARE).length + empq3.filter(x => x.Option2 === OPTIONS.BLUE_SQUARE).length,
                BlueTriangles: subq3.filter(x => x.Option1 === OPTIONS.BLUE_TRIANGLE).length + empq3.filter(x => x.Option1 === OPTIONS.BLUE_TRIANGLE).length + empq3.filter(x => x.Option2 === OPTIONS.BLUE_TRIANGLE).length,
                YellowCircles: subq3.filter(x => x.Option1 === OPTIONS.YELLOW_CIRCLE).length + empq3.filter(x => x.Option1 === OPTIONS.YELLOW_CIRCLE).length + empq3.filter(x => x.Option2 === OPTIONS.YELLOW_CIRCLE).length,
                YellowSquares: subq3.filter(x => x.Option1 === OPTIONS.YELLOW_SQUARE).length + empq3.filter(x => x.Option1 === OPTIONS.YELLOW_SQUARE).length + empq3.filter(x => x.Option2 === OPTIONS.YELLOW_SQUARE).length,
                YellowTriangles: subq3.filter(x => x.Option1 === OPTIONS.YELLOW_TRIANGLE).length + empq3.filter(x => x.Option1 === OPTIONS.YELLOW_TRIANGLE).length + empq3.filter(x => x.Option2 === OPTIONS.YELLOW_TRIANGLE).length
            }
        };

        var rebels =
        {
            Q1:
            {
                BlueCircles: rebq1.filter(x => x.Option1 === OPTIONS.BLUE_CIRCLE).length + rebq1.filter(x => x.Option2 === OPTIONS.BLUE_CIRCLE).length,
                BlueSquares: rebq1.filter(x => x.Option1 === OPTIONS.BLUE_SQUARE).length + rebq1.filter(x => x.Option2 === OPTIONS.BLUE_SQUARE).length,
                BlueTriangles: rebq1.filter(x => x.Option1 === OPTIONS.BLUE_TRIANGLE).length + rebq1.filter(x => x.Option2 === OPTIONS.BLUE_TRIANGLE).length,
                YellowCircles: rebq1.filter(x => x.Option1 === OPTIONS.YELLOW_CIRCLE).length + rebq1.filter(x => x.Option2 === OPTIONS.YELLOW_CIRCLE).length,
                YellowSquares: rebq1.filter(x => x.Option1 === OPTIONS.YELLOW_SQUARE).length + rebq1.filter(x => x.Option2 === OPTIONS.YELLOW_SQUARE).length,
                YellowTriangles: rebq1.filter(x => x.Option1 === OPTIONS.YELLOW_TRIANGLE).length + rebq1.filter(x => x.Option2 === OPTIONS.YELLOW_TRIANGLE).length
            },
            Q2:
            {
                BlueCircles: rebq2.filter(x => x.Option1 === OPTIONS.BLUE_CIRCLE).length + rebq2.filter(x => x.Option2 === OPTIONS.BLUE_CIRCLE).length,
                BlueSquares: rebq2.filter(x => x.Option1 === OPTIONS.BLUE_SQUARE).length + rebq2.filter(x => x.Option2 === OPTIONS.BLUE_SQUARE).length,
                BlueTriangles: rebq2.filter(x => x.Option1 === OPTIONS.BLUE_TRIANGLE).length + rebq2.filter(x => x.Option2 === OPTIONS.BLUE_TRIANGLE).length,
                YellowCircles: rebq2.filter(x => x.Option1 === OPTIONS.YELLOW_CIRCLE).length + rebq2.filter(x => x.Option2 === OPTIONS.YELLOW_CIRCLE).length,
                YellowSquares: rebq2.filter(x => x.Option1 === OPTIONS.YELLOW_SQUARE).length + rebq2.filter(x => x.Option2 === OPTIONS.YELLOW_SQUARE).length,
                YellowTriangles: rebq2.filter(x => x.Option1 === OPTIONS.YELLOW_TRIANGLE).length + rebq2.filter(x => x.Option2 === OPTIONS.YELLOW_TRIANGLE).length
            },
            Q3:
            {
                BlueCircles: rebq3.filter(x => x.Option1 === OPTIONS.BLUE_CIRCLE).length + rebq3.filter(x => x.Option2 === OPTIONS.BLUE_CIRCLE).length,
                BlueSquares: rebq3.filter(x => x.Option1 === OPTIONS.BLUE_SQUARE).length + rebq3.filter(x => x.Option2 === OPTIONS.BLUE_SQUARE).length,
                BlueTriangles: rebq3.filter(x => x.Option1 === OPTIONS.BLUE_TRIANGLE).length + rebq3.filter(x => x.Option2 === OPTIONS.BLUE_TRIANGLE).length,
                YellowCircles: rebq3.filter(x => x.Option1 === OPTIONS.YELLOW_CIRCLE).length + rebq3.filter(x => x.Option2 === OPTIONS.YELLOW_CIRCLE).length,
                YellowSquares: rebq3.filter(x => x.Option1 === OPTIONS.YELLOW_SQUARE).length + rebq3.filter(x => x.Option2 === OPTIONS.YELLOW_SQUARE).length,
                YellowTriangles: rebq3.filter(x => x.Option1 === OPTIONS.YELLOW_TRIANGLE).length + rebq3.filter(x => x.Option2 === OPTIONS.YELLOW_TRIANGLE).length
            }
        };

        $("#empire .queue[data-q='1'] .blue .triangle").attr("data-c", empire.Q1.BlueTriangles).addClass("forceredraw").removeClass("forceredraw"); // ADD/REMOVE CLASS FORCEREDRAW TO FORCE A REDRAW OF THE ELEMENT TO SHOW THE UPDATED STATS
        $("#empire .queue[data-q='1'] .blue .square").attr("data-c", empire.Q1.BlueSquares).addClass("forceredraw").removeClass("forceredraw");
        $("#empire .queue[data-q='1'] .blue .circle").attr("data-c", empire.Q1.BlueCircles).addClass("forceredraw").removeClass("forceredraw");
        $("#empire .queue[data-q='1'] .yellow .triangle").attr("data-c", empire.Q1.YellowTriangles).addClass("forceredraw").removeClass("forceredraw");
        $("#empire .queue[data-q='1'] .yellow .square").attr("data-c", empire.Q1.YellowSquares).addClass("forceredraw").removeClass("forceredraw");
        $("#empire .queue[data-q='1'] .yellow .circle").attr("data-c", empire.Q1.YellowCircles).addClass("forceredraw").removeClass("forceredraw");
        $("#empire .queue[data-q='2'] .blue .triangle").attr("data-c", empire.Q2.BlueTriangles).addClass("forceredraw").removeClass("forceredraw");
        $("#empire .queue[data-q='2'] .blue .square").attr("data-c", empire.Q2.BlueSquares).addClass("forceredraw").removeClass("forceredraw");
        $("#empire .queue[data-q='2'] .blue .circle").attr("data-c", empire.Q2.BlueCircles).addClass("forceredraw").removeClass("forceredraw");
        $("#empire .queue[data-q='2'] .yellow .triangle").attr("data-c", empire.Q2.YellowTriangles).addClass("forceredraw").removeClass("forceredraw");
        $("#empire .queue[data-q='2'] .yellow .square").attr("data-c", empire.Q2.YellowSquares).addClass("forceredraw").removeClass("forceredraw");
        $("#empire .queue[data-q='2'] .yellow .circle").attr("data-c", empire.Q2.YellowCircles).addClass("forceredraw").removeClass("forceredraw");
        $("#empire .queue[data-q='3'] .blue .triangle").attr("data-c", empire.Q3.BlueTriangles).addClass("forceredraw").removeClass("forceredraw");
        $("#empire .queue[data-q='3'] .blue .square").attr("data-c", empire.Q3.BlueSquares).addClass("forceredraw").removeClass("forceredraw");
        $("#empire .queue[data-q='3'] .blue .circle").attr("data-c", empire.Q3.BlueCircles).addClass("forceredraw").removeClass("forceredraw");
        $("#empire .queue[data-q='3'] .yellow .triangle").attr("data-c", empire.Q3.YellowTriangles).addClass("forceredraw").removeClass("forceredraw");
        $("#empire .queue[data-q='3'] .yellow .square").attr("data-c", empire.Q3.YellowSquares).addClass("forceredraw").removeClass("forceredraw");
        $("#empire .queue[data-q='3'] .yellow .circle").attr("data-c", empire.Q3.YellowCircles).addClass("forceredraw").removeClass("forceredraw");

        $("#rebels .queue[data-q='1'] .blue .triangle").attr("data-c", rebels.Q1.BlueTriangles).addClass("forceredraw").removeClass("forceredraw");
        $("#rebels .queue[data-q='1'] .blue .square").attr("data-c", rebels.Q1.BlueSquares).addClass("forceredraw").removeClass("forceredraw");
        $("#rebels .queue[data-q='1'] .blue .circle").attr("data-c", rebels.Q1.BlueCircles).addClass("forceredraw").removeClass("forceredraw");
        $("#rebels .queue[data-q='1'] .yellow .triangle").attr("data-c", rebels.Q1.YellowTriangles).addClass("forceredraw").removeClass("forceredraw");
        $("#rebels .queue[data-q='1'] .yellow .square").attr("data-c", rebels.Q1.YellowSquares).addClass("forceredraw").removeClass("forceredraw");
        $("#rebels .queue[data-q='1'] .yellow .circle").attr("data-c", rebels.Q1.YellowCircles).addClass("forceredraw").removeClass("forceredraw");
        $("#rebels .queue[data-q='2'] .blue .triangle").attr("data-c", rebels.Q2.BlueTriangles).addClass("forceredraw").removeClass("forceredraw");
        $("#rebels .queue[data-q='2'] .blue .square").attr("data-c", rebels.Q2.BlueSquares).addClass("forceredraw").removeClass("forceredraw");
        $("#rebels .queue[data-q='2'] .blue .circle").attr("data-c", rebels.Q2.BlueCircles).addClass("forceredraw").removeClass("forceredraw");
        $("#rebels .queue[data-q='2'] .yellow .triangle").attr("data-c", rebels.Q2.YellowTriangles).addClass("forceredraw").removeClass("forceredraw");
        $("#rebels .queue[data-q='2'] .yellow .square").attr("data-c", rebels.Q2.YellowSquares).addClass("forceredraw").removeClass("forceredraw");
        $("#rebels .queue[data-q='2'] .yellow .circle").attr("data-c", rebels.Q2.YellowCircles).addClass("forceredraw").removeClass("forceredraw");
        $("#rebels .queue[data-q='3'] .blue .triangle").attr("data-c", rebels.Q3.BlueTriangles).addClass("forceredraw").removeClass("forceredraw");
        $("#rebels .queue[data-q='3'] .blue .square").attr("data-c", rebels.Q3.BlueSquares).addClass("forceredraw").removeClass("forceredraw");
        $("#rebels .queue[data-q='3'] .blue .circle").attr("data-c", rebels.Q3.BlueCircles).addClass("forceredraw").removeClass("forceredraw");
        $("#rebels .queue[data-q='3'] .yellow .triangle").attr("data-c", rebels.Q3.YellowTriangles).addClass("forceredraw").removeClass("forceredraw");
        $("#rebels .queue[data-q='3'] .yellow .square").attr("data-c", rebels.Q3.YellowSquares).addClass("forceredraw").removeClass("forceredraw");
        $("#rebels .queue[data-q='3'] .yellow .circle").attr("data-c", rebels.Q3.YellowCircles).addClass("forceredraw").removeClass("forceredraw");
    },

    IsTouchDevice: function ()
    {
        var prefixes = " -webkit- -moz- -o- -ms- ".split(" ");

        var mq = function (query) { return window.matchMedia(query).matches; };

        if (("ontouchstart" in window) || window.DocumentTouch && document instanceof DocumentTouch)
            return true;

        // include the "heartz" as a way to have a non matching MQ to help terminate the join
        // https://git.io/vznFH
        var query = ["(", prefixes.join("touch-enabled),("), "heartz", ")"].join("");
        return mq(query);
    }
};

var LIGHTSABER =
{
    OVERRIDE_CHANGED: false,

    Setup: function ()
    {
        var _this = this;

        $(".lightsaber input:checkbox").on("change", function ()
        {
            var $this = $(this);

            if ($this.is(":checked"))
                _this.PlayOn();
            else
                _this.PlayOff();

            if ($this.attr("id") === "override")
                _this.OVERRIDE_CHANGED = !_this.OVERRIDE_CHANGED;

            var options = {};
            options.prompt   = $("#prompt").is(":checked");
            options.override = $("#override").is(":checked");
            options.continue = $("#promptc").is(":checked");

            REBELLION.SKIPCONFIRM = !options.prompt;
            REBELLION.OVERRIDE = options.override;

            localStorage.setItem(PRESETUP.STORAGE_KEY_OPTIONS, JSON.stringify(options));
        });
    },

    PlayOn: function ()
    {
        new Audio("/content/misc/lightsaber-on.mp3").play();
    },

    PlayOff: function ()
    {
        new Audio("/content/misc/lightsaber-off.mp3").play();
	}
};