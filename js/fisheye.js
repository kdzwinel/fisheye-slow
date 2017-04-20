var peopleList = (function() {
	var people = [];

	function add(person) {
		people.push(person);
	}

	function getAll() {
		return people;
	}

	return {
		add: add,
		getAll: getAll
	};

})();

for(var i=0, max=40; i<max; i++) {
	peopleList.add({
		name: Faker.Name.findName(),
		userName: Faker.Internet.userName(),
		company: Faker.Company.companyName(),
		phoneNumber: Faker.PhoneNumber.phoneNumber(),
		city: Faker.Address.city,
		picture: 'http://lorempixel.com/300/300?rnd=' + Math.random()
	});
}

function showPerson($el, person) {
	$el.addClass('selected');

	if(!$el.data('infoBox')) {
	   var infoBox = $('#infoBox').clone().attr('id', '');

	   infoBox.find('.phone').text(person.phoneNumber);
	   infoBox.find('.company').text(person.company);
	   infoBox.find('.city').text(person.city);
	   $el.data('infoBox', infoBox);
	} else {
		var infoBox = $el.data('infoBox');
	}

	var elPos = $el.position();
	var wrapPos = $('#wrapper').position();
	infoBox.css({
	   'left': elPos.left - wrapPos.left,
	   'top': elPos.top - wrapPos.top
	});
	$('#wrapper').append(infoBox);

	infoBox.show();
	setTimeout(function() {
		infoBox.addClass('shown');
	}, 15);

	$('#shadow').show();
}

function hidePerson($el) {
	var infoBox = $el.data('infoBox');
	infoBox.on('transitionend', function() {
		$(this).remove();
		$('#shadow').hide();

		$el.css('transition', 'transform 0.3s');
		$el.one('transitionend', function() {
			$el.css('transition', 'none');
		});
		$el.removeClass('selected');
	});
	infoBox.removeClass('shown');
}

function fishEye() {
	$('#people li').each(function(i, el){
		var items = $('#people li').length;
		var scrollTop = $(document).scrollTop();
		var docH = $(document).height();
		var winH = $(window).height();
		var myValue = (docH-winH)/items * i;

		var distance = Math.abs(myValue-scrollTop);
		distance = (distance > 500) ? 500 : distance;

		var scale = ((500 - distance)/500 * 1.2);
		scale = (scale < 0.8) ? 0.8 : scale;

		$(el).css({
			'transition': 'none',
			'width': scale * 300 + 'px',
			'height': scale * 50 + 'px',
		});
	});
}

$(document).ready(function(){
	var liTpl = $('<li><img><span class="name"></span><span class="userName"></span><button/></li>');
	var lis = [];
	var people = peopleList.getAll();

	for(var idx in people) {
		var li = liTpl.clone(true);
		var person = people[idx];

		li.data('person', person);
		li.find('.name').text(person.name);
		li.find('.userName').text(person.userName);
		li.find('img').attr('src', person.picture);

		lis.push(li);
	}

	$('#people').append(lis);
	$('#people').on('click', 'button', function() {
		var $li = $(this).parent();

		if(!$li.is('.selected')) {
			showPerson($li, $li.data('person'));
		} else {
			hidePerson($li);
		}
	});

	$(document).scroll(fishEye);
	fishEye();
});