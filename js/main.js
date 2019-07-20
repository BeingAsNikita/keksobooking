'use strict';

var MAP = document.querySelector('.map');
var LOCATION_WIDTH = MAP.offsetWidth;
var LOCATION_BORDER_TOP = 130;
var LOCATION_BORDER_RIGHT = LOCATION_WIDTH;
var LOCATION_BORDER_BOT = 630;
var LOCATION_BORDER_LEFT = 0;
var PINS_WIDTH = 50;
var PINS_HEIGHT = 70;
var QUANTITY_PINS = 8;
var TYPE_OF_HOUSING = ['palace', 'flat', 'house', 'bungalo'];
var pinTemplate = document.querySelector('#pin').content.querySelector('.map__pin');
var MAP_PINS = document.querySelector('.map__pins');
var formAd = document.querySelector('.ad-form');
var formFieldsets = document.querySelectorAll('fieldset');
var formFilters = document.querySelector('.map__filters').querySelectorAll('*');
var mainPin = document.querySelector('.map__pin--main');
var adsIsrender = false;
var address = document.querySelector('#address');
var typeOfHousing = document.querySelector('#type');
var price = document.querySelector('#price');
var timeIn = document.querySelector('#timein');
var timeOut = document.querySelector('#timeout');


var period = function() {
    switch(timeIn.value) {
      case "12:00":
        timeOut.selectedIndex = 0;
      break;
      case "13:00":
        timeOut.selectedIndex = 1;
      break;
      case "14:00":
        timeOut.selectedIndex = 2;
      break;
    }
}

var setTypeOfHousing = function() {
  switch(typeOfHousing.value) {
    case "bungalo":
      price.setAttribute('min', '0');
      price.setAttribute('placeholder', '0');
    break;
    case "flat":
      price.setAttribute('min', '1000');
      price.setAttribute('placeholder', '1000');
    break;
    case "house":
      price.setAttribute('min', '5000');
      price.setAttribute('placeholder', '5000');
    break;
    case "palace":
      price.setAttribute('min', '10000');
      price.setAttribute('placeholder', '10000');
    break;
  }
}

var getAddressСoordinates = function() {
  address.value = (parseInt(mainPin.style.left, 10) + PINS_WIDTH/2) + ', ' + (parseInt(mainPin.style.top, 10) + PINS_HEIGHT);
}

var setInactiveMode = function (elements) {
  for (var i = 0; i < elements.length; i++) {
    elements[i].setAttribute('disabled', 'true');
  }
};

var setActiveMode = function (elements) {
  for (var i = 0; i < elements.length; i++) {
    elements[i].removeAttribute('disabled');
  }
  formAd.classList.remove('ad-form--disabled');

  if (!adsIsrender) {
    renderAds(QUANTITY_PINS);
    adsIsrender = true;
  }
};

var getAvatars = function(count) {
  var avatars = [];

  for ( var i = 1; i <= count; i++) {
    avatars.push('img/avatars/user' + ((i > 9) ? i : '0'+i) + '.png');
  }
  return avatars;
}

var getNumberFromRange = function (start, end) {
  return (start + Math.ceil(Math.random()*(end-start)));
};

var getTypeOfHousing = function(types) {
  return types[getNumberFromRange(0, types.length-1)];
}

var getUniqueElementFromArray = function(arr) {
  return arr.splice(getNumberFromRange(0, arr.length-1), 1)[0];
}

var getSimilarAds = function(quantity) {
  var result =[];
  var avatars = getAvatars(quantity);
  for (var i = 0; i < quantity; i++) {
     result.push({
      author: {
        avatar: getUniqueElementFromArray(avatars)
      },
      offer: {
        type: getTypeOfHousing(TYPE_OF_HOUSING)
      },
      location: {
        x: getNumberFromRange(0, LOCATION_WIDTH - PINS_WIDTH/2),
        y: getNumberFromRange(130-PINS_HEIGHT/2, 630-PINS_HEIGHT/2)
      }
    })
  }
  return result;
};

var renderAd = function(ad) {
  var adElement = pinTemplate.cloneNode(true);

  adElement.style.left = ad.location.x + 'px';
  adElement.style.top = ad.location.y + 'px';
  adElement.children[0].src = ad.author.avatar;
  adElement.children[0].alt = 'Заголовок объявления';
  return adElement;
};

var renderAds = function(count) {
  var fragment = document.createDocumentFragment();
  var  ads = getSimilarAds(count);
  for (var i = 0; i < ads.length; i++) {
    fragment.appendChild(renderAd(ads[i]));
  }

  MAP_PINS.appendChild(fragment);
  MAP.classList.remove('map--faded');
};

typeOfHousing.addEventListener('change', function() {
  setTypeOfHousing();
})

timeIn.addEventListener('change', function() {
  period();
})

mainPin.addEventListener('mousedown', function (evt) {
  evt.preventDefault();

  var startCoords = {
    x: evt.clientX,
    y: evt.clientY
  };

  var onMouseMove = function (moveEvt) {
    moveEvt.preventDefault();

    var shift = {
      x: startCoords.x - moveEvt.clientX,
      y: startCoords.y - moveEvt.clientY
    };

    startCoords = {
      x: moveEvt.clientX,
      y: moveEvt.clientY
    };


    mainPin.style.top = (mainPin.offsetTop - shift.y) + 'px';
    mainPin.style.left = (mainPin.offsetLeft - shift.x) + 'px';

    var mainPinTop = mainPin.offsetTop - shift.y;
    var mainPinLeft = mainPin.offsetLeft - shift.x;

    if (mainPinTop < LOCATION_BORDER_TOP) {
      mainPinTop = LOCATION_BORDER_TOP;
    }

    if (mainPinTop > LOCATION_BORDER_BOT - PINS_HEIGHT) {
      mainPinTop = LOCATION_BORDER_BOT - PINS_HEIGHT;
    }

    if (mainPinLeft < LOCATION_BORDER_LEFT) {
      mainPinLeft = LOCATION_BORDER_LEFT;
    }

    if (mainPinLeft > LOCATION_BORDER_RIGHT - PINS_WIDTH) {
      mainPinLeft = LOCATION_BORDER_RIGHT - PINS_WIDTH;
    }

    mainPin.style.top = mainPinTop + 'px';
    mainPin.style.left = mainPinLeft + 'px';
  };

  var onMouseUp = function (upEvt) {
    upEvt.preventDefault();
    if (!adsIsrender) {
      setActiveMode(formFieldsets);
      setActiveMode(formFilters);
    }

    getAddressСoordinates();

    document.removeEventListener('mousemove', onMouseMove);
    document.removeEventListener('mouseup', onMouseUp);
  };

  document.addEventListener('mousemove', onMouseMove);
  document.addEventListener('mouseup', onMouseUp);
});

setInactiveMode(formFieldsets);
setInactiveMode(formFilters);

