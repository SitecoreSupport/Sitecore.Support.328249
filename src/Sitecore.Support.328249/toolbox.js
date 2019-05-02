var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = y[op[0] & 2 ? "return" : op[0] ? "throw" : "next"]) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [0, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var SXAToolbox;
(function (SXAToolbox) {
    var Toolbox = (function () {
        function Toolbox(sxaJquery, cookies) {
            this.cookieName = "sxa-toolbox-json";
            this.toolBoxPlaceholder = "#wrapper";
            this.ribbonPlaceholder = "#scWebEditRibbon";
            this.defaultSettings = {
                activeGroupList: [],
                isMobile: false,
                opened: false,
                position: {},
            };
            this.$ = sxaJquery;
            this.$.xaMover.refreshConfiguration();
            this.cookies = cookies;
            this.init();
        }
        Toolbox.prototype.stringToDOM = function (markup) {
            var parser = new DOMParser(), el = parser.parseFromString(markup, "text/html");
            return el.querySelector("body>*");
        };
        Toolbox.prototype.loadConfiguration = function () {
            return __awaiter(this, void 0, void 0, function () {
                var result, scSite, error_1;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            scSite = window.location.search.slice(1).split("&").find(function (el) {
                                return el.indexOf("sc_site=") > -1;
                            });
                            scSite = scSite ? scSite : "sc_mode=edit";
                            _a.label = 1;
                        case 1:
                            _a.trys.push([1, 3, , 4]);
                            return [4, this.$.ajax({
                                    data: {
                                        allowedRenderings: JSON.stringify(this.getAllowedRenderings()),
                                    },
                                    dataType: "json",
                                    type: "POST",
                                    url: "/~/sxa-toolbox/renderings-feed/?" + scSite,
                                })];
                        case 2:
                            result = _a.sent();
                            return [2, result];
                        case 3:
                            error_1 = _a.sent();
                            console.error(error_1);
                            return [3, 4];
                        case 4: return [2];
                    }
                });
            });
        };
        Toolbox.prototype.filterAllowedComponents = function (renderings) {
            var _this = this;
            return renderings.filter(function (element) {
                return _this.$.xaMover.allowedRenderings.indexOf(element.ID) > -1;
            });
        };
        Toolbox.prototype.addNotificationIfEmpty = function (renderings, translations) {
            if (Object.keys(renderings).length === 0) {
                renderings[translations.NoRenderings] = [];
            }
            return renderings;
        };
        Toolbox.prototype.toggleDeviceMode = function () {
            var toolboxSetting = this.getCookieSettings();
            toolboxSetting.isMobile = !toolboxSetting.isMobile;
            this.cookies.createCookie(this.cookieName, JSON.stringify(toolboxSetting));
            this.$("#sxa-toolbox").toggleClass("sxa-mobile-toolbox");
            this.$("body").trigger("sxa-toolbox-refresh");
        };
        Toolbox.prototype.toggleComponentsGroup = function (event) {
            var toolboxSetting = this.getCookieSettings(), $target = this.$(event.target), sectionName = $target.data("section-name");
            if ((event.type === "click" && toolboxSetting.isMobile) ||
                (event.type !== "click" && !toolboxSetting.isMobile) ||
                !sectionName) {
                return;
            }
            if (!toolboxSetting.activeGroupList) {
                toolboxSetting.activeGroupList = [];
            }
            if (toolboxSetting.activeGroupList && toolboxSetting.activeGroupList.indexOf(sectionName) === -1) {
                toolboxSetting.activeGroupList.push(sectionName);
            }
            else {
                toolboxSetting.activeGroupList = toolboxSetting.activeGroupList.filter(function (arrElement) {
                    return arrElement !== sectionName;
                });
            }
            this.cookies.createCookie(this.cookieName, JSON.stringify(toolboxSetting));
            $target.toggleClass("expanded");
        };
        Toolbox.prototype.makeDraggable = function () {
            var cachedDraggable;
            var that = this, dragger = {
                appendTo: "#wrapper",
                containment: "html",
                cursorAt: { top: -20, left: 20 },
                helper: "clone",
                opacity: 0.7,
                refreshPositions: true,
                start: function () {
                    that.$(".ui-draggable-dragging").addClass("toolbox-item");
                    window.$xa.xaMover.prepareDroppablePlaceholders(that.$(this), that.$("#sxa-toolbox"));
                    cachedDraggable = that.$(".ui-draggable-dragging");
                    cachedDraggable.refreshCounter = 0;
                },
                stop: function () {
                    setTimeout(function () {
                        window.$xa.xaMover.clearDroppablePlaceholders();
                    }, 50);
                },
                scroll: true,
            };
            this.$("#sxa-toolbox-root li span").draggable(dragger);
        };
        Toolbox.prototype.fixToolboxHeight = function () {
            this.$("#sxa-toolbox-root").css({ height: this.getVisibleHeight() + "px" });
        };
        Toolbox.prototype.bindEvents = function () {
            var _this = this;
            var that = this, ribbon = this.$(this.ribbonPlaceholder), ribbonContents = ribbon.contents(), ribbonSwitcher = ribbonContents.find("nav > [data-sc-id='QuickRibbon']") ||
                ribbonContents.find(".sc-quickbar-item.sc-quickbar-button.sc_QuickbarButton_56");
            this.$("body")
                .on("sxa-toolbox-refresh", function () {
                _this.refreshToolbox();
            })
                .on("click", ".sxa-toggle-device", function () {
                _this.toggleDeviceMode();
            })
                .on("touchstart pointerdown MSPointerDown", ".sxa-toggle-device-touch", function () {
                _this.toggleDeviceMode();
            })
                .on("click touchstart pointerdown MSPointerDown", "#sxa-toolbox-root span", function (event) {
                _this.toggleComponentsGroup(event);
            })
                .on("click touchstart pointerdown MSPointerDown", ".sxa-toolbox-expander", function () {
                _this.toggleVisibility();
            });
            Sitecore.PageModes.ChromeManager.chromesReseted.observe(function () {
                that.$.xaMover.refreshConfiguration();
                setTimeout(function () { that.fixToolboxHeight(); }, 0);
            });
            ribbonContents.on("click", "nav > [data-sc-id='QuickRibbon'],.sc-quickbar-item.sc-quickbar-button.sc_QuickbarButton_56", function () {
                that.fixToolboxHeight();
            });
            this.makeDraggable();
        };
        Toolbox.prototype.groupComponentByNames = function (renderings, translations) {
            var groupedComponents = {};
            renderings.forEach(function (element) {
                if (!groupedComponents[element.Parent]) {
                    groupedComponents[element.Parent] = [];
                }
                groupedComponents[element.Parent].push(element);
            });
            groupedComponents = this.addNotificationIfEmpty(groupedComponents, translations);
            return groupedComponents;
        };
        Toolbox.prototype.setInitialSettings = function () {
            var settings = Object.assign(this.defaultSettings, this.getCookieSettings());
            this.cookies.createCookie(this.cookieName, JSON.stringify(settings));
        };
        Toolbox.prototype.getMarkup = function (config) {
            var settings = JSON.parse(this.cookies.readCookie(this.cookieName)), allowedComponents = this.filterAllowedComponents(config.renderings), groupedComponents = this.groupComponentByNames(allowedComponents, config.translations);
            var newToolbox = "<div id=\"sxa-toolbox\" class=\"" + (settings.opened ? "show-toolbox" : "") + "  " + (settings.isMobile ? "sxa-mobile-toolbox" : "") + "\">\n                    <div class=\"sxa-toolbox-expander\"></div>\n                    <div class=\"handle sxa-toolbox-header\">\n                        <div class=\"sxa-toolbox-label\">" + config.translations.Toolbox + "</div>\n                        <div class=\"sxa-toggle-device\"></div>\n                        <div class=\"sxa-toggle-device-touch\"></div>\n                    </div>\n                    <div class=\"mCustomScrollbar\">\n                        <div id=\"sxa-toolbox-root\" style=\"height:" + this.getVisibleHeight() + "px\">\n                            " + (Object.keys(groupedComponents) && Object.keys(groupedComponents).map(function (componentGroup) { return "\n                                <div>\n                                    <span id=\"sxa-toolbox-section\" data-section-name=\"" + componentGroup.toLocaleLowerCase() + "\"\n                                        class=\"" + (settings.activeGroupList.indexOf(componentGroup.toLocaleLowerCase()) > -1 ? "expanded" : "") + "\">\n                                        " + componentGroup + "\n                                    </span>\n                                    <ul>\n                                    " + groupedComponents[componentGroup].map(function (component) { return "\n                                        <li>\n                                            " + (settings.isMobile ? "\n                                                <div class=\"gripper-icon touch-gripper\">\n                                                    <svg xmlns=\"http://www.w3.org/2000/svg\" xmlns:xlink=\"http://www.w3.org/1999/xlink\"\n                                                    version=\"1.1\" id=\"Layer_1\" x=\"0px\" y=\"0px\" width=\"30px\" height=\"30px\" viewBox=\"0 0 512 512\"\n                                                    style=\"enable-background:new 0 0 512 512;\" xml:space=\"preserve\">\n                                                        <g>\n                                                            <rect y=\"144\" width=\"512\" height=\"32\"/>\n                                                            <rect y=\"240\" width=\"512\" height=\"32\"/><rect y=\"336\" width=\"512\" height=\"32\"/>\n                                                        </g>\n                                                    </svg>\n                                                </div>"
                : "") + "\n                                            <span data-icon=\"" + component.Icon + "\" data-icon24=\"" + component.Icon24 + "\"\n                                                data-id=\"" + component.ID + "\" style=\"background:\n                                                url(" + (settings.isMobile ? "" + component.Icon24 : "" + component.Icon) + ")\n                                                no-repeat 5px 5px;\">\n                                                " + component.Name + "\n                                            </span>\n                                        </li>\n                                    "; }).join(" ") + "\n                                    </ul>\n                                </div>\n                            "; }).join(" ")) + "\n                        </div>\n                    </div>\n                </div>";
            return this.stringToDOM(newToolbox);
        };
        Toolbox.prototype.getVisibleHeight = function () {
            return this.$(window).height() +
                this.$(window).scrollTop() -
                document.getElementById(this.toolBoxPlaceholder.slice(1)).offsetTop -
                (this.$(".sxa-toolbox-header").height() || 20);
        };
        Toolbox.prototype.getAllowedRenderings = function () {
            var allowedRenderings = [], chromes = Sitecore.PageModes.ChromeManager.chromes(), i, j, chrome, renderings = [];
            for (i = 0; i < chromes.length; i++) {
                chrome = chromes[i];
                if (chrome.data !== undefined &&
                    chrome.data.custom !== undefined &&
                    chrome.data.custom.allowedRenderings !== undefined) {
                    var chromeRenderings = chrome.data.custom.allowedRenderings;
                    for (j = 0; j < chromeRenderings.length; j++) {
                        if (this.$.inArray(chromeRenderings[j], allowedRenderings) === -1) {
                            allowedRenderings.push(chromeRenderings[j]);
                        }
                    }
                }
            }
            chromes.filter(function (e) {
                return e.data.custom != null &&
                    e.data.custom.editable === "true" &&
                    e.data.custom.allowedRenderings != null &&
                    e.data.custom.allowedRenderings.length > 0;
            }).forEach(function (e) {
                for (var i_1 = 0; i_1 < e.data.custom.allowedRenderings.length; i_1++) {
                    var current = e.data.custom.allowedRenderings[i_1];
                    if (renderings.indexOf(current) >= 0) {
                        continue;
                    }
                    renderings.push(current);
                }
            });
            return renderings;
        };
        Toolbox.prototype.addCustomScroll = function () {
            this.$("#sxa-toolbox-root").mCustomScrollbar({
                theme: "minimal-dark",
            });
        };
        // Patch 328249 start
        window.$xa(window).resize(function () {
			window.$xa("body").trigger("sxa-toolbox-refresh");
		});
        // Patch 328249 end
        Toolbox.prototype.handleResponse = function (message, result) {
            if (message !== "chrome:placeholder:controladdingcancelled") {
                this.$.xaMover.currentChrome.type.addControlResponse(result.id, result.openProperties, result.dataSource);
            }
            else {
                this.$.xaMover.cleanup();
            }
        };
        Toolbox.prototype.getCookieSettings = function () {
            var optionsString = this.cookies.readCookie(this.cookieName) || "{}", options = JSON.parse(optionsString);
            return options;
        };
        Toolbox.prototype.toggleVisibility = function () {
            var toolboxSetting = this.getCookieSettings(), toolbox = this.$("#sxa-toolbox");
            toolboxSetting.opened = !toolboxSetting.opened;
            this.cookies.createCookie(this.cookieName, JSON.stringify(toolboxSetting));
            toolboxSetting.opened ? toolbox.addClass("show-toolbox") : toolbox.removeClass("show-toolbox");
        };
        Toolbox.prototype.refreshToolbox = function () {
            var data = this.config, toolboxMarkup = this.getMarkup(data);
            this.$("#sxa-toolbox").remove();
            this.$(toolboxMarkup).insertBefore(this.toolBoxPlaceholder);
            this.addCustomScroll();
            this.makeDraggable();
        };
        Toolbox.prototype.init = function () {
            var _this = this;
            if (this.config) {
                return;
            }
            this.loadConfiguration()
                .then(function (data) {
                _this.config = data;
                _this.setInitialSettings();
                _this.refreshToolbox();
                _this.bindEvents();
                _this.$(document).trigger("sxa-toolbox-loaded");
            })
                .catch(function (error) {
                console.info(error);
            });
        };
        return Toolbox;
    }());
    SXAToolbox.Toolbox = Toolbox;
})(SXAToolbox || (SXAToolbox = {}));
window.$xa(document).ready(function () {
    window.$xa.toolbox = new SXAToolbox.Toolbox(window.$xa, window.XA.cookies);
});