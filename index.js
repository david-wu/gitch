#!/usr/bin/env node

var _ = require('lodash');
var exec = require('child_process').exec
var fuzzy = require('fuzzy');

getBranches()
	.then(getMatch.bind(null, process.argv[2]))
	.then(checkout)
	// .then(status)
	.catch(logErr);

// function status(){
// 	return new Promise(function(res, rej){
// 		exec('git status', function(err, stdout, stderr){
// 			if(err){
// 				return rej(err);
// 			}
// 			console.log(stdout)
// 		});
// 	});
// }

function checkout(branch){
	return new Promise(function(res, rej){
		exec('git checkout '+branch, function(err, stdout, stderr){
			if(err){
				return rej(err);
			}
			res(branch);
			console.log('checked out: '+branch);
		});
	})
}

function getMatch(query, branches){
	var result = fuzzy.filter(query, branches)[0];
	if(!result){
		throw 'no match'
	}
	return result.string;
}

function getBranches(){
	return new Promise(function(res, rej){
		exec('git branch -a', function(err, stdout, stderr){
			if(err){
				return rej(err)
			}
			var branches = stdout.replace(/ /g, '').replace(/\*/g, '').split('\n');
			branches = _.filter(branches, function(branch){
				return !_.includes(branch, '->');
			})
			branches.pop();
			return res(branches);
		});
	});
}

function logErr(err){
	console.log(err.toString())
}

