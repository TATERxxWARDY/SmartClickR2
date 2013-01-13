var QM = require('./modules/question-manager');
var CM = require('./modules/choice-manager');

// POST /user/:User_ID/poll/:Poll_ID/question/create //
// create each question //
exports.postNewQuestion = function(request, response) {

	QM.newQuestion({ Poll_ID : request.param('Poll_ID'),
					 AType   : request.param('questionType'),
					 Order   : request.param('count') }, function(qid) {
		
		console.log("Question ID", qid);
		console.log('Posting Question type....', request.body.questionType);

		var stem = '';

		if(request.param('questionType') == 'MC') {

			var answer = '';
			var choices = request.param('question')[1];
			stem = request.param('question')[0];
			console.log('Stem ',request.param('question')[0]);
			
			QM.updateStem({ Stem : stem, Question_ID : qid }, function(o) {
				for(var i = 0; i < choices.length; i++) {

					CM.createMCChoices({ Question_ID : qid, Order : i+1, Answer : answer, Content : choices[i] }, function(err, results) {
						// create choices for MC
					});
				}
			});

		} else if (request.param('questionType') == 'TF') {

			stem = request.body.question[0];
			console.log(stem);
			console.log(request.body.question[1]);

			QM.updateStem({ Stem : stem,
			 				Question_ID : qid }, function(o) {
				
				if(request.body.question.length == 2) {
					CM.createTFChoices({ Question_ID : qid, Answer : request.body.question[1] }, function(o) {
						// create choices for TF
					});
				}
			});				

		} else if (request.param('questionType') == 'FR') {

			stem = request.body.question[0];
			
			QM.updateStem({ Stem : stem,
							Question_ID : qid }, function(o) { });

		} else if (request.param('questionType') == 'N') {
			//numeric
			stem = request.body.question[0];
			QM.updateStem({ Stem : stem,
							Question_ID : qid }, function(o) { });
		}
	});
}



/*






*/