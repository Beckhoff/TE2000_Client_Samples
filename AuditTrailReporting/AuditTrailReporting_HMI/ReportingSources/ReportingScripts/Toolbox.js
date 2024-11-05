var Reporting = Reporting || (Reporting = {});
(function (Reporting) {
    let Toolbox;
    (function (Toolbox) {
        /**
         * A class to create the entries of an audit trail report.
         */
        class Element {
            constructor() {
                this._icons = new Reporting.Images.Icons();
            }

            /**
             * Creates a new html element based on given type and appends it to its parent element. 
             */
            createNewElement(parentElement, elementType, elementName) {
                if (!parentElement) {
                    return undefined;
                }
                let element = document.createElement(elementType);
                element.className = `${parentElement.classList[0]}_${elementName}`;
                parentElement.appendChild(element);
                return element;
            }

            /**
             * Creates a new error element.
             */
            createErrorElement(parentElement, error) {
                if (!parentElement) {
                    return;
                }
                    let iconContainer = this.createNewElement(parentElement, "div", `Error`);
                    iconContainer.classList.add("reportError");
                    iconContainer.innerHTML = error;
            }

            /**
             * Creates a new Icon element.
             */
            createIcon(parentElement, contextDomain, image) {
                if (!parentElement) {
                    return;
                }
                    let iconContainer = this.createNewElement(parentElement, "div", `Icon`);
                    iconContainer.classList.add("reportIcon");
                    let iconImage = this.createNewElement(iconContainer, "div", `Image`);
                    iconImage.classList.add("reportIcon_Image", `${contextDomain}Icon`);
                    if (image !== undefined && image !== null && image !== "") {
                        iconImage.innerHTML = image;
                    }
            }

            /**
             * Creates a new element displaying the timestamp and type of an audit trail entry.
             */
            createGeneralInformation(parentElement, type, timeStamp) {
                if (!parentElement) {
                    return;
                }
                let timeStampContainer = this.createNewElement(parentElement, "div", `GeneralInformation`);
                timeStampContainer.classList.add("reportGridGeneral");
                let timeStampHeader = this.createNewElement(timeStampContainer, "div", `Header`);
                timeStampHeader.classList.add("reportGridGeneral_Header", "reportHeader");
                timeStampHeader.innerHTML = `${type}`;
                let timeStampDate = this.createNewElement(timeStampContainer, "div", `Date`);
                timeStampDate.classList.add("reportGridGeneral_Date", /*"reportSubElement"*/);
                let timeStampTimeZone = this.createNewElement(timeStampContainer, "div", `TimeZone`);
                timeStampTimeZone.classList.add("reportGridGeneral_TimeZone",  /*"reportSubElement",*/ "reportHint");
                if (timeStamp) {
                    // Time
                    var timeStamp = new Date(timeStamp);
                    var day = timeStamp.getDate() < 10 ? "0" + timeStamp.getDate() : timeStamp.getDate();
                    var month = timeStamp.getMonth() < 9 ? "0" + (timeStamp.getMonth() + 1) : (timeStamp.getMonth() + 1);
                    var hours = timeStamp.getHours() < 10 ? "0" + timeStamp.getHours() : timeStamp.getHours();
                    var minutes = timeStamp.getMinutes() < 10 ? "0" + timeStamp.getMinutes() : timeStamp.getMinutes();
                    var seconds = timeStamp.getSeconds() < 10 ? "0" + timeStamp.getSeconds() : timeStamp.getSeconds();
                    timeStampDate.innerHTML = `${timeStamp.getFullYear()}/${day}/${month} ${hours}:${minutes}:${seconds}.${timeStamp.getMilliseconds()}`;
                    // TimeZone
                    let timeZoneOffset = timeStamp.getTimezoneOffset() / 60;
                    timeStampTimeZone.innerHTML = `UTC: ${Math.trunc(timeZoneOffset)}:${Math.abs(60 * (timeZoneOffset - Math.trunc(timeZoneOffset)))}`;
                }
            }

            /**
             * Creates a new domain name element.
             */
            createDomainName(parentElement, contextDomain) {
                if (!parentElement) {
                    return;
                }
                let domainNameContainer = this.createNewElement(parentElement, "div", `DomainName`);
                domainNameContainer.classList.add("reportGridDomainName");
                let domainNameHeader = this.createNewElement(domainNameContainer, "div", `Header`);
                domainNameHeader.classList.add("reportGridDomainName_Header", "reportHeader");
                domainNameHeader.innerHTML = `Domain:`;
                let domainNameValue = this.createNewElement(domainNameContainer, "div", `Value`);
                domainNameValue.classList.add("reportGridDomainName_Value", "reportSubElement");
                domainNameValue.innerHTML = contextDomain;
            }

            /**
             * Creates a new element displaying the changed values of an audit trail entry.
             */
            createValues(parentElement, value, symbol) {
                if (!parentElement) {
                    return;
                }
                let valuesContainer = this.createNewElement(parentElement, "div", `Values`);
                valuesContainer.classList.add("reportGridValues");
                let valuesHeader = this.createNewElement(valuesContainer, "div", `Header`);
                valuesHeader.classList.add("reportGridValues_Header", "reportHeader");
                valuesHeader.innerHTML = `Value:`;
                let valuesValue = this.createNewElement(valuesContainer, "div", `Value`);
                valuesValue.classList.add("reportGridValues_Value", "reportSubElement");
                valuesValue.innerHTML = value;
                if (symbol !== "" && symbol !== null && symbol !== undefined) {
                    let valuesSymbol = this.createNewElement(valuesContainer, "div", `Symbol`);
                    valuesSymbol.classList.add("reportGridValues_Symbol", "reportSubElement", "reportHint");
                    valuesSymbol.innerHTML = symbol;
                }
            }

            /**
             * Creates a new element the changed value objects of an audit trail entry.
             */
            createValuesObject(parentElement, text, oldValue, newValue, symbol) {
                if (!parentElement) {
                    return;
                }
                let valuesContainer = this.createNewElement(parentElement, "div", `Values`);
                valuesContainer.classList.add("reportGridValues");
                let valuesHeader = this.createNewElement(valuesContainer, "div", `Header`);
                valuesHeader.classList.add("reportGridValues_Header", "reportHeader");
                valuesHeader.innerHTML = `Value:`;
                let valuesText = this.createNewElement(valuesContainer, "div", `Text`);
                valuesText.classList.add("reportGridValues_Text", "reportSubElement");
                valuesText.innerHTML = text;

                let valuesValue = this.createNewElement(valuesContainer, "div", `ValueContainer`);
                valuesValue.classList.add("reportGridValues_ValueContainer", "reportSubElement");
                let valuesOldValue = this.createNewElement(valuesValue, "div", `ValueContainer`);
                valuesOldValue.classList.add("reportGridValues_ValueOld");
                valuesOldValue.innerHTML = `Old value:<br> ${JSON.stringify(oldValue, null, 4).replace(/\n/g, "<br/>").replace(/ /g, "&nbsp")}`;
                let valuesNewValue = this.createNewElement(valuesValue, "div", `ValueContainer`);
                valuesNewValue.classList.add("reportGridValues_ValueNew");
                valuesNewValue.innerHTML = `New value:<br>${JSON.stringify(newValue, null, 4).replace(/\n/g, "<br/>").replace(/ /g, "&nbsp")}`;
                if (symbol !== "" && symbol !== null && symbol !== undefined) {
                    let valuesSymbol = this.createNewElement(valuesContainer, "div", `Symbol`);
                    valuesSymbol.classList.add("reportGridValues_Symbol", "reportSubElement", "reportHint");
                    valuesSymbol.innerHTML = symbol;
                }
            }

            /**
             * Creates a new comment element.
             */
            createComment(parentElement, comment) {
                if (!parentElement) {
                    return;
                }
                let commentContainer = this.createNewElement(parentElement, "div", `Comment`);
                commentContainer.classList.add("reportGridComment");
                let commentHeader = this.createNewElement(commentContainer, "div", `Header`);
                commentHeader.classList.add("reportGridComment_Header", "reportHeader");
                commentHeader.innerHTML = "Comment:";
                let commentValue = this.createNewElement(commentContainer, "div", `Value`);
                commentValue.classList.add("reportGridComment_Value", "reportSubElement");
                if (comment) {
                    comment = comment.replace('\\n','<br>');
                    commentValue.innerHTML = comment;
                } else {
                    commentContainer.classList.toggle("DISPLAY_NONE", true);
                }
            }

            /**
             * Creates a new error element.
             */
            createError(parentElement, error) {
                if (!parentElement) {
                    return;
                }
                let errorContainer = this.createNewElement(parentElement, "div", `Error`);
                errorContainer.classList.add("reportGridError");
                let errorHeader = this.createNewElement(errorContainer, "div", `Header`);
                errorHeader.classList.add("reportGridError_Header", "reportHeader");
                errorHeader.innerHTML = "Error:";
                let errorValue = this.createNewElement(errorContainer, "div", `Value`);
                errorValue.classList.add("reportGridError_Value", "reportSubElement");
                if (error?.reason) {
                    errorValue.innerHTML = error.reason;
                    parentElement.classList.add("userFailed");
                } else if (error?.message) {
                    errorValue.innerHTML = error.message;
                    parentElement.classList.add("userFailed");
                } else {
                    errorContainer.classList.toggle("DISPLAY_NONE", true);
                }
            }

            /**
             * Creates a new element displaying the current user.
             */
            createLoggedInUser(parentElement, userName, domain) {
                if (!parentElement) {
                    return;
                }
                let userNameContainer = this.createNewElement(parentElement, "div", `UserName`);
                userNameContainer.classList.add("reportGridDomainName");
                let userNameHeader = this.createNewElement(userNameContainer, "div", `Header`);
                userNameHeader.classList.add("reportGridUserName_Header", "reportHeader");
                userNameHeader.innerHTML = "Active User:";
                let userNameValue = this.createNewElement(userNameContainer, "div", `Value`);
                userNameValue.classList.add("reportGridUserName_Value", "reportSubElement");
                userNameValue.innerHTML = userName;
                if (domain !== "" && domain !== null && domain !== undefined) {
                    let userNameDomain = this.createNewElement(userNameContainer, "div", `Domain`);
                    userNameDomain.classList.add("reportGridUserName_Domain", "reportSubElement", "reportHint");
                    userNameDomain.innerHTML = domain;
                }
            }

            /**
             * Creates a new element displaying the reauthentication user.
             */
            createReauthentication(parentElement, data) {
                if (!parentElement) {
                    return;
                }
                let userMainContainer = this.createNewElement(parentElement, "div", `Reauthentication`);
                userMainContainer.classList.add("reportGridReauthentication");
                if (Array.isArray(data)) {
                    for (let i = 0; i < data.length; i++) {
                        let userNameContainer = this.createNewElement(userMainContainer, "div", `UserName_` + i);
                        userNameContainer.classList.add("reportGridReauthenticationName");
                        let userNameHeader = this.createNewElement(userNameContainer, "div", `Header`);
                        userNameHeader.classList.add("reportGridReauthentication_Header", "reportHeader");
                        if (data.length > 1) {
                            userNameHeader.innerHTML = `Reauthentication User ${(i + 1)}:`;
                        } else {
                            userNameHeader.innerHTML = `Reauthentication User:`;
                        }
                        let userNameValue = this.createNewElement(userNameContainer, "div", `Value`);
                        userNameValue.classList.add("reportGridReauthentication_Value", "reportSubElement");
                        userNameValue.innerHTML = data[i]?.user;
                        if (data[i]?.domain !== "") {
                            let userNameDomain = this.createNewElement(userNameContainer, "div", `Domain`);
                            userNameDomain.classList.add("reportGridReauthentication_Domain", "reportSubElement", "reportHint");
                            userNameDomain.innerHTML = data[i]?.domain;
                        }
                    }
                }
            }

            /**
             * Creates a new message element.
             */
            createMessage(parentElement, message) {
                if (!parentElement) {
                    return;
                }
                let messageContainer = this.createNewElement(parentElement, "div", `Message`);
                messageContainer.classList.add("reportGridMessage");
                let messageHeader = this.createNewElement(messageContainer, "div", `Header`);
                messageHeader.classList.add("reportGridMessage_Header", "reportHeader");
                messageHeader.innerHTML = "Message:";
                let messageValue = this.createNewElement(messageContainer, "div", `Value`);
                messageValue.classList.add("reportGridMessage_Value", "reportSubElement");
                messageValue.innerHTML = message;
            }

            /**
             * Creates a new audit error element.
             */
            createAuditError(parentElement, data) {
                parentElement.classList.add("reportGridSub");
                let tmpElement = this.createNewElement(parentElement, "div", "Audit");
                tmpElement.classList.add("reportGridAudit");
                let sortedValue = data.payload.parameters.content.sort((data1, data2) => (data1.entry.timestamp > data2.entry.timestamp) ? 1 : (data1.entry.timestamp < data2.entry.timestamp) ? -1 : 0);
                this.createEntries(tmpElement, sortedValue);
            }

            /**
             * Deleta all sub elements of an element.
             */
            deleteAllSubElements(parentElement) {
                if (parentElement) {
                    parentElement.textContent = '';
                }
            }

            /**
             * Filters the data for persisting data from previous sessions and preprocess the data.
             */
            filterAndPreprocessData(data) {
                let filteredData = [];

                for (let dataElement of data) {
                    if (dataElement.entry) {
                        dataElement = dataElement.entry;
                    }
                    // Always show symbols
                    if (dataElement.type === "Symbol") {
                        filteredData.push(dataElement);
                        continue;
                    }
                    
                    if (
                        // AUTH_FAILED
                        // LOGIN_LOG
                        dataElement.reauthentication?.writeValue?.persistPreviousSession === true ||
                        dataElement.payload?.parameters?.persistPreviousSession === true ||
                        // LOGOUT_LOG
                        dataElement.payload?.parameters?.reason === "PersistPreviousSession"
                    ) {
                        continue;
                    }
                    filteredData.push(dataElement);
                }
                return filteredData;
            }

            /**
             * Creates an element for each entry of the given dataset and appends them to the given parent element.
             */
            createEntries(parentElement, data) {
                data = this.filterAndPreprocessData(data);
                try {
                    if (data && Array.isArray(data)) {
                        for (let i = 0; i < data.length; i++) {
                            let tmpData = data[i];
                            if (tmpData.entry) {
                                tmpData = tmpData.entry;
                            }
                            let tmpElement = this.createNewElement(parentElement, "div", i);
                            tmpElement.classList.add("reportGrid");
                            // default rows
                            let image = "";
                            switch (tmpData.contextDomain) {
                                case "TcHmiSrv":
                                    if (tmpData.name.includes("TcHmiRecipeManagement")) {
                                        image = this._icons.getRecipe().data;
                                    } else {
                                        image = this._icons.getUser().data;
                                    }
                                    break;
                                case "TcHmiRecipeManagement":
                                    image = this._icons.getRecipe().data;
                                    break;
                                case "TcHmiEventLogger":
                                case "TcHmiAlarm":
                                    image = this._icons.getMessage().data;
                                    break;
                                case "TcHmiAuditTrail":
                                    if (tmpData.name === "addEventAuditError"
                                        || tmpData.name === "addCommandAuditError") {
                                        image = this._icons.getAuditTrailError().data;
                                    } else {
                                        image = this._icons.getAuditTrail().data;
                                    }
                                    break;
                                default:
                                    if (tmpData.name === "AuditLogEntry") {
                                        image = this._icons.getAuditTrailInteraction().data;
                                    }
                                    break;
                            }
                            this.createIcon(tmpElement, tmpData.contextDomain, image);
                            this.createGeneralInformation(tmpElement, tmpData.type, tmpData.timestamp);
                            try {
                                if (tmpData.name === "AuditLogEntry") {
                                    // javascript action
                                    let user = tmpData.userName.split("::");
                                    this.createLoggedInUser(tmpElement, user[user.length - 1], user[user.length - 2]);
                                    this.createComment(tmpElement, tmpData.comment);
                                } else if (tmpData.name === "auditTrailErrorLogMessage") {
                                    // audit trail error log message
                                    this.createDomainName(tmpElement, tmpData.contextDomain);
                                    this.createAuditError(tmpElement, tmpData);
                                } else if (tmpData.name === "addEventAuditError" || tmpData.name === "addCommandAuditError") {
                                    // audit trail error
                                    this.createDomainName(tmpElement, tmpData.contextDomain);
                                    this.createValues(tmpElement, tmpData.localizedText);
                                } else if (tmpData.name === "AUTH_FAILED") {
                                    // auth failed
                                    let payload = tmpData.payload;
                                    let user = payload.parameters.userName.split("::")
                                    this.createLoggedInUser(tmpElement, user[user.length - 1], user[user.length - 2]);
                                    this.createValues(tmpElement, `User Authentication Failed`);
                                } else if (tmpData.contextDomain === "TcHmiAlarm") {
                                    // alarm
                                    this.createDomainName(tmpElement, tmpData.contextDomain);
                                    this.createValues(tmpElement, tmpData.localizedText);
                                    this.createComment(tmpElement, tmpData.comment);
                                } else if (tmpData.contextDomain === "TcHmiEventLogger") {
                                    // eventlogger
                                    this.createDomainName(tmpElement, tmpData.contextDomain);
                                    this.createValues(tmpElement, tmpData.localizedText);
                                    this.createComment(tmpElement, tmpData.comment);
                                } else if (tmpData.type === "Function") {
                                    // function
                                    //CreateDomainName(tmpElement, tmpData.contextDomain);
                                    let user = tmpData.userName.split("::");
                                    this.createLoggedInUser(tmpElement, user[user.length - 1], user[user.length - 2]);
                                    this.createMessage(tmpElement, `Function ${tmpData.name} called <br>New value: ${JSON.stringify(tmpData.newValue)}`);
                                } else if (tmpData.name === "LOGIN_LOG") {
                                    // login
                                    let payload = tmpData.payload;
                                    this.createLoggedInUser(tmpElement, payload.parameters.userName.split("::")[1], payload.parameters.userName.split("::")[0]);
                                    this.createValues(tmpElement, `User Login`);
                                } else if (tmpData.name === "LOGOUT_LOG") {
                                    // logout
                                    let payload = tmpData.payload;
                                    this.createLoggedInUser(tmpElement, payload.parameters.userName.split("::")[1], payload.parameters.userName.split("::")[0]);
                                    this.createValues(tmpElement, "User Logout");
                                } else if (tmpData.name === "auditTrailDatabaseReset") {
                                    // database reset
                                    this.createDomainName(tmpElement, tmpData.contextDomain)
                                    this.createValues(tmpElement, tmpData.localizedText);
                                } else if (tmpData.type === "Symbol") {
                                    // symbol
                                    let user = tmpData.userName.split("::");
                                    this.createLoggedInUser(tmpElement, user[user.length - 1], user[user.length - 2]);
                                    let tmpOldValue = tmpData.oldValue === undefined || tmpData.oldValue === null || tmpData.oldValue === "" ? "(empty)" : tmpData.oldValue;
                                    if (typeof tmpOldValue === 'object'
                                        || typeof tmpData.newValue === 'object') {
                                        this.createValuesObject(tmpElement, `Value was changed`, tmpOldValue, tmpData.newValue, tmpData.name);
                                    } else {
                                        this.createValues(tmpElement, `Value was changed from <b>${tmpOldValue}</b> to <b>${tmpData.newValue}</b>`, tmpData.name);
                                    }
                                    if (tmpData.reauthentication) {
                                        let users = [];
                                        let reauthenticationUser = tmpData.reauthentication?.writeValue?.userName?.split("::");
                                        if (!(reauthenticationUser === undefined || reauthenticationUser.length < 2)) {
                                            users.push({
                                                user: reauthenticationUser[reauthenticationUser.length - 1],
                                                domain: reauthenticationUser[reauthenticationUser.length - 2]
                                            });
                                            this.createReauthentication(tmpElement, users);
                                        }
                                    }
                                    this.createComment(tmpElement, tmpData.comment);
                                } else {
                                    this.deleteAllSubElements(tmpElement);
                                    tmpElement.classList.add("reportGridError");
                                    this.createErrorElement(tmpElement, "No matching filter entry / Keinen passenden filter gefunden");
                                    this.createErrorElement(tmpElement, JSON.stringify(tmpData));
                                }

                                this.createError(tmpElement, tmpData.error);
                            } catch (err) {
                                this.deleteAllSubElements(tmpElement);
                                tmpElement.classList.add("reportGridError");
                                this.createErrorElement(tmpElement, `Create error: ` + JSON.stringify(err));
                                this.createErrorElement(tmpElement, JSON.stringify(tmpData));
                            }
                        }
                    } else {
                        this.deleteAllSubElements(parentElement);
                        parentElement.classList.add("reportGridError");
                        this.createErrorElement(parentElement, "No Entry / Kein Eintrag");
                        this.createErrorElement(parentElement, JSON.stringify(data));
                    }
                }
                catch (err) {
                    parentElement.innerHTML = `Create main error: <br>` + err;
                }
            }

        }
        Toolbox.Element = Element;
    })(Toolbox = Reporting.Toolbox || (Reporting.Toolbox = {}));
})(Reporting);
