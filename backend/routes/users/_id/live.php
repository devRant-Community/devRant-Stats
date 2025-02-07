<?php

function init () {
	ignore_user_abort(true);
}

function validate ($id) {
	return is_numeric($id);
}

function GET ($id) {
	$response = json_decode(file_get_contents(DEVRANT_API . "/users/" . $id . "?app=3"));

	if ($response->success) {
		$data = [
			'score' => $response->profile->score,
			'rant' => $response->profile->content->counts->rants,
		    'upvoted' => $response->profile->content->counts->upvoted,
		    'comments' => $response->profile->content->counts->comments,
		    'favorites' => $response->profile->content->counts->favorites,
		    'collabs' => $response->profile->content->counts->collabs
		];
		View::eventStream(json_encode($data));
	} else {
		View::eventStream("Error");
	}
}

function finalize () {
	flush();
}