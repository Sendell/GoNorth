(function(GoNorth) {
    "use strict";
    (function(DefaultNodeShapes) {
        (function(Actions) {

            /**
             * Move object action
             * @class
             */
            Actions.MoveObjectToNpcAction = function()
            {
                GoNorth.DefaultNodeShapes.Actions.BaseAction.apply(this);
                GoNorth.DefaultNodeShapes.Shapes.SharedObjectLoading.apply(this);
            };

            Actions.MoveObjectToNpcAction.prototype = jQuery.extend({ }, GoNorth.DefaultNodeShapes.Actions.BaseAction.prototype);
            Actions.MoveObjectToNpcAction.prototype = jQuery.extend(Actions.MoveObjectToNpcAction.prototype, GoNorth.DefaultNodeShapes.Shapes.SharedObjectLoading.prototype);

            /**
             * Returns the HTML Content of the action
             * 
             * @returns {string} HTML Content of the action
             */
            Actions.MoveObjectToNpcAction.prototype.getContent = function() {
                return "<div class='gn-actionNodeObjectSelectContainer'>" +
                            "<a class='gn-actionNodeNpcSelect gn-clickable'>" + DefaultNodeShapes.Localization.Actions.ChooseNpcLabel + "</a>" +
                            "<a class='gn-clickable gn-nodeActionOpenObject' title='" + DefaultNodeShapes.Localization.Actions.OpenNpcTooltip + "' style='display: none'><i class='glyphicon glyphicon-eye-open'></i></a>" +
                        "</div>";
            };

            /**
             * Gets called once the action was intialized
             * 
             * @param {object} contentElement Content element
             * @param {ActionNode} actionNode Parent Action node
             */
            Actions.MoveObjectToNpcAction.prototype.onInitialized = function(contentElement, actionNode) {
                this.contentElement = contentElement;

                var npcOpenLink = contentElement.find(".gn-nodeActionOpenObject");

                // Deserialize
                var deserializedData = this.deserializeData();
                if(deserializedData) {
                    this.nodeModel.set("actionRelatedToObjectType", Actions.RelatedToObjectNpc);
                    this.nodeModel.set("actionRelatedToObjectId", deserializedData.npcId);

                    this.loadNpc(deserializedData.npcId);
                }

                // Handlers
                var self = this;
                var selectNpcAction = contentElement.find(".gn-actionNodeNpcSelect");
                selectNpcAction.on("click", function() {
                    GoNorth.DefaultNodeShapes.openNpcSearchDialog().then(function(npc) {
                        selectNpcAction.data("npcid", npc.id);
                        selectNpcAction.text(npc.name);
                        
                        // Set related object data
                        self.nodeModel.set("actionRelatedToObjectType", Actions.RelatedToObjectNpc);
                        self.nodeModel.set("actionRelatedToObjectId", npc.id);

                        self.saveData(npc.id)

                        npcOpenLink.show();
                    });
                });
                 
                npcOpenLink.on("click", function() {
                    if(selectNpcAction.data("npcid"))
                    {
                        window.open("/Kortisto/Npc?id=" + selectNpcAction.data("npcid"))
                    }
                });
            };

            /**
             * Deserializes the data
             */
            Actions.MoveObjectToNpcAction.prototype.deserializeData = function() {
                var actionData = this.nodeModel.get("actionData");
                if(!actionData)
                {
                    return null;
                }

                var data = JSON.parse(actionData);
                
                var selectNpcAction = this.contentElement.find(".gn-actionNodeNpcSelect");
                selectNpcAction.data("npcid", data.npcId);

                return data;
            };

            /**
             * Loads the npc
             * @param {string} npcId Id of the npc
             */
            Actions.MoveObjectToNpcAction.prototype.loadNpc = function(npcId) {
                var self = this;
                this.loadObjectShared(npcId).then(function(npc) {
                    if(!npc) 
                    {
                        return;
                    }

                    self.contentElement.find(".gn-actionNodeNpcSelect").text(npc.name);
                    self.contentElement.find(".gn-nodeActionOpenObject").show();
                });
            };

            /**
             * Saves the data
             * @param {string} npcId Npc id
             */
            Actions.MoveObjectToNpcAction.prototype.saveData = function(npcId) {
                var serializeData = {
                    npcId: npcId
                };

                this.nodeModel.set("actionData", JSON.stringify(serializeData));
            };

            
            /**
             * Returns the object id
             * 
             * @returns {string} Object Id
             */
            Actions.MoveObjectToNpcAction.prototype.getObjectId = function(existingData) {
                return existingData.npcId;
            };
            
            /**
             * Returns the object resource
             * 
             * @returns {int} Object Resource
             */
            Actions.MoveObjectToNpcAction.prototype.getObjectResource = function() {
                return GoNorth.DefaultNodeShapes.Shapes.ObjectResourceNpc;
            };

            /**
             * Loads the npcs
             * 
             * @returns {jQuery.Deferred} Deferred for the npc loading
             */
            Actions.MoveObjectToNpcAction.prototype.loadObject = function() {
                var def = new jQuery.Deferred();

                var selectNpcAction = this.contentElement.find(".gn-actionNodeNpcSelect");

                jQuery.ajax({ 
                    url: "/api/KortistoApi/FlexFieldObject?id=" + selectNpcAction.data("npcid"), 
                    type: "GET"
                }).done(function(data) {
                    def.resolve(data);
                }).fail(function(xhr) {
                    def.reject();
                });

                return def.promise();
            };

        }(DefaultNodeShapes.Actions = DefaultNodeShapes.Actions || {}));
    }(GoNorth.DefaultNodeShapes = GoNorth.DefaultNodeShapes || {}));
}(window.GoNorth = window.GoNorth || {}));