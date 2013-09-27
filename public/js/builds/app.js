App = Ember.Application.create({
  LOG_TRANSITIONS: true
});

App.ApplicationAdapter = DS.RESTAdapter.extend({
  namespace: 'api',
  host: 'http://localhost/embel/public'
});

var attr = DS.attr;

Ember.Handlebars.registerBoundHelper('date', 
    function(date) {
        return moment(date).format('DD/MM/YYYY');
    }
);;App.Achievement = DS.Model.extend({
  title: DS.attr('string'),
  achieved_at: DS.attr('date')
});
  ;App.Router.map(function() {
    this.route("index", { path: "/" });
    this.route("achievements");
});;App.AchievementsRoute = Ember.Route.extend({
  model: function() {
      var store = this.get('store');
      return store.find('achievement');
  }
});
;App.AchievementsController = Ember.ArrayController.extend({
  sortProperties: [ 'achieved_at' ],

  sortAscending: false,

  isValid: (function(){
    msg = "";
    isValid = true;
    str = this.get('newAchievement');
    day = /\bd\d\d\b/.exec(str);
    month = /\bm\d\d\b/.exec(str);

    if(!str) {
        isValid = false;
        msg += "Field cannot be empty, fool !";
    };

    if (day) {
        if (parseInt(day[0].split('d')[1]) > 31 ) {
            isValid = false;
            msg += 'Invalid day idiot !';
        };
    };

    if (month) {
        if (parseInt(month[0].split('m')[1]) > 12 ) {
            isValid = false;
            msg += 'Invalid month idiot !';
        };
    };

    this.set('errorMessage', msg);
    return isValid;
  }).property('newAchievement'),

  actions: {
    addAchievement: function() {
      data = this.parseInput(this.get('newAchievement'))
      var achievement = this.store.createRecord('achievement', {
        title: data['title'],
        achieved_at: data['achieved_at']
      });
      this.set('newAchievement', '');
      achievement.save();
    }
  },
  parseInput: function(str) {
    day = /\bd\d\d\b/.exec(str);
    month = /\bm\d\d\b/.exec(str);
    year = /\by\d{4}\b/.exec(str);

    achieved_at = new Date();
    title = str;

    if (day) {
        title = title.replace(day[0], "");
        achieved_at.setDate(day[0].split('d')[1]);
    };

    if (month) {
        title = title.replace(month[0], "");
        achieved_at.setMonth(parseInt(month[0].split('m')[1]) - 1);
    };

    if (year) {
        title = title.replace(year[0], "");
        achieved_at.setYear(year[0].split('y')[1]);
    };

    title.replace(/\s+/, " ");

    return {
        title : title,
        achieved_at : achieved_at
    };
  }
});