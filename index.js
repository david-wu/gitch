#!/usr/bin/env node

var exec = require('child_process').exec
var fuzzy = require('fuzzy');

getBranches()
	.then(getMatch)
	.then(checkout)
	.then(console.log.bind(null, 'checked out:'))
	.catch(console.log.bind(null, 'error:'));

function getBranches(){
	return new Promise(function(res, rej){
		exec('git branch -a', function(err, stdout, stderr){
			if(err){return rej(err);}

			var branches = stdout.replace(/ /g, '').replace(/\*/g, '').split('\n');
			branches = branches.filter(function(branch){
				return branch.indexOf('->') === -1;
			});
			branches.pop();
			return res(branches);
		});
	});
}

function getMatch(branches){
	var result = fuzzy.filter(process.argv[2], branches)[0];
	if(!result){
		throw 'no match'
	}
	return result.string;
}

function checkout(branch){
	return new Promise(function(res, rej){
		exec('git checkout '+branch, function(err, stdout, stderr){
			if(err){return rej(err);}

			res(branch);
		});
	})
}
