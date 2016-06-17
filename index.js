#!/usr/bin/env node

var exec = require('child_process').exec
var fuzzy = require('fuzzy');

var query = process.argv[2];

if(!query){
	return console.log('missing query!');
}

getBranches()
	.then(getMatch)
	.then(checkout)
	.then(console.log.bind(null, 'checked out:'))
	.catch(console.log.bind(null, 'error:'));

function getBranches(){
	return new Promise(function(res, rej){
		exec('git branch -a', {maxBuffer: 10 * 1024 * 1024}, function(err, stdout, stderr){
			if(err){return rej(err);}

			var branches = stdout.replace(/ /g, '').replace(/\*/g, '').split('\n');
			branches = branches.filter(function(branch){
				return branch.indexOf('->') === -1;
			});
			branches.pop();
			return res(branches.concat(branches).concat(branches).concat(branches).concat(branches));
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

			return res(branch);
		});
	})
}
