var validation = require("mw.validation");
var jsonpatch = require('fast-json-patch');

class Places {
  constructor(data) {
    this.data = data;
  }
  configure(app) {
    const data = this.data;

    app.get("/api/places/:id", function(request, response) {
      let id = request.params.id;
      return data.getPlaceAsync(id).then(function(place) {
        if (place !== undefined) {
          response.status(200).json(place);
          return;
        }
        response.status(404).json({
          key: "entity.not.found"
        });
      });
    });
    
    app.options('/api/places', function(request, response) {
      response.header('Access-Control-Allow-Origin', 'http://localhost:3000');
      response.header('Access-Control-Allow-Methods', 'GET,POST');
      response.header('Access-Control-Allow-Headers', 'my-header-custom');
      response.header('Access-Control-Max-Age', '30');
      response.json();
    });
    

    app.get("/api/places", function(request, response) {
      response.setHeader("Access-Control-Allow-Origin", "http://localhost:3000");
      response.setHeader('Access-Control-Allow-Methods', 'GET,POST');
      response.setHeader('Access-Control-Allow-Headers', 'my-header-custom');
      response.setHeader('Cache-Control', 'public, max-age=15');
      return data.getPlacesAsync().then(function(places) {
        if (places !== undefined) {
          places = { "places" : places };
          response.status(200).json(places);
          return;
        }
        response.status(404).json({
          key: "entity.not.found"
        });
      });
    });

    app.post("/api/places", function(request, response) {
      var place = request.body;

      var onlyIfImage = function(){
        if(place.image && place.image.url){
          return true;
        }
        return false;
     }

      const rules = {
        name: [
          "required",
          {
            minLength: {
              minLength: 3,
              message: "Expression is too short {minLength} characters minimum"
            }
          },
          {
            maxLength: {
              maxLength: 100,
              message: "Expression is too long {maxLength} characters maximum"
            }
          },
          {
            pattern: {
              regex: /^[a-zA-Z -]*$/,
              message: "Expression must contains only letters or -"
            }
          }
        ],
        author: [
          "required",
          {
            minLength: {
              minLength: 3,
              message: "Expression is too short {minLength} characters minimum"
            }
          },
          {
            maxLength: {
              maxLength: 100,
              message: "Expression is too long {maxLength} characters maximum"
            }
          },
          {
            pattern: {
              regex: /^[a-zA-Z -]*$/,
              message: "Expression must contains only letters or -"
            }
          }
        ],
        review: ["required", "digit"],
        "@image": {
          url: ["url"],
          title: [
            {
              required: {
                onlyIf: onlyIfImage,
                message: "Field Image title is required"
              },
              minLength: {
                minLength: 3,
                message: "Expression is too short {minLength} characters minimum"
              },
              maxLength: {
                maxLength: 100,
                message: "Expression is too long {maxLength} characters maximum"
              },
              pattern: {
                regex: /^[a-zA-Z -]*$/,
                message: "Expression must contains only letters or -"
              }
            }
          ]
        }
      };

      var validationResult = validation.objectValidation.validateModel(
        place,
        rules,
        true
      );
      
      if (!validationResult.success) {
        console.log(validationResult.detail);
        response.status(400).json({
          key: "entity.error.validation"
        });
      }

      return data.savePlaceAsync(place).then(function(id) {
        response.setHeader("Location", /places/)
        if (id !== undefined) {
          response.status(201).json(id);
          return;
        }
        response.status(400).json({
          key: "entity.not.valid"
        });
        return;
      });
    });
    
    app.delete("/api/places/:id", function(request, response) {
      let id = request.params.id;
      let file = new File();

      return data.deletePlaceAsync(id).then(function(isDeleted) {
        if (isDeleted) {
          response.status(204).json({
            key: "entity.deleted"
          });
          return;
        }
        response.status(404).json({
          key: "entity.not.found"
        });
      });
    });

    app.put("/api/places/:id", function(request, response) {
      let id = request.params.id;
      var place = request.body;
      var responseCode = 0;

      var onlyIfImage = function(){
        if(place.image && place.image.url){
          return true;
        }
        return false;
     }

      const rules = {
        name: [
          "required",
          {
            minLength: {
              minLength: 3,
              message: "Expression is too short {minLength} characters minimum"
            }
          },
          {
            maxLength: {
              maxLength: 100,
              message: "Expression is too long {maxLength} characters maximum"
            }
          },
          {
            pattern: {
              regex: /^[a-zA-Z -]*$/,
              message: "Expression must contains only letters or -"
            }
          }
        ],
        author: [
          "required",
          {
            minLength: {
              minLength: 3,
              message: "Expression is too short {minLength} characters minimum"
            }
          },
          {
            maxLength: {
              maxLength: 100,
              message: "Expression is too long {maxLength} characters maximum"
            }
          },
          {
            pattern: {
              regex: /^[a-zA-Z -]*$/,
              message: "Expression must contains only letters or -"
            }
          }
        ],
        review: ["required", "digit"],
        "@image": {
          url: ["url"],
          title: [
            {
              required: {
                onlyIf: onlyIfImage,
                message: "Field Image title is required"
              },
              minLength: {
                minLength: 3,
                message: "Expression is too short {minLength} characters minimum"
              },
              maxLength: {
                maxLength: 100,
                message: "Expression is too long {maxLength} characters maximum"
              },
              pattern: {
                regex: /^[a-zA-Z -]*$/,
                message: "Expression must contains only letters or -"
              }
            }
          ]
        }
      };

      var validationResult = validation.objectValidation.validateModel(
        place,
        rules,
        true
      );
      
      if (!validationResult.success) {
        console.log(validationResult.detail);
        response.status(400).json({
          key: "entity.error.validation"
        });
      }

      place.id = id;

      return data.getPlaceAsync(id).then(function(oldPlace) {
        if (oldPlace == null)
          responseCode = 204;
        else
          responseCode = 201;
        
        return data.savePlaceAsync(place).then(function(id) {
          if (id !== undefined) {
            console.log('HEYYYYYYYYYYYYYYYYYYYYYYYYYYY');
            console.log(responseCode);

            response.status(responseCode).json(id);
            return;
          }
          console.log("badbadbad")
          response.status(400).json({
            key: "entity.not.valid"
          });
        });
      });
    });

    app.patch("/api/places/:id", function(request, response) {
      let id = request.params.id;
      var place = request.body;

      if(!id){
        response.status(400).json({
          key: "id.not.valid"
        });
        return;
      }

      return data.getPlaceAsync(id).then(function(oldPlace) {
        var newPlace = Object.assign(oldPlace, place);

        return data.savePlaceAsync(newPlace).then(function(id) {
          if (id !== undefined) {
            response.status(204).json(id);
            return;
          }
          response.status(400).json({
            key: "entity.not.valid"
          });
          return;
        });

      });
    });

    app.patch("/api/json/places/:id", function(request, response) {
      let id = request.params.id;
      let patch = request.body;

      if(!id){
        response.status(400).json({
          key: "id.not.valid"
        });
        return;
      }

      response.setHeader("Content-Type","application/json-patch+json; charset=utf-8");

      return data.getPlaceAsync(id).then(function(oldPlace) {
        var newPlace = jsonpatch.applyPatch(oldPlace, patch).newDocument;

        return data.savePlaceAsync(newPlace).then(function(id) {
          if (id !== undefined) {
            response.status(204).json(id);
            return;
          }
          response.status(400).json({
            key: "entity.not.valid"
          });
          return;
        });

      });
    });

  }
}
module.exports = Places;
