suite('Dependencies', function() {
	suite('jQuery', function() {
		test('Should be present', function() {
			assert.ok(window.jQuery);
		});
	});
	suite('Backbone', function() {
		test('Should be present', function() {
			assert.ok(window.Backbone);
		});
	});
	suite('Underscore', function() {
		test('Should be present', function() {
			assert.ok(window._);
		});
	});
});

suite('App', function() {
	test('Should be present', function() {
		assert.ok(window.bTask);
	});

	suite('Tweet', function() {
		test('Should be present', function() {
			assert.ok(window.bTask);
		});
	});

});

