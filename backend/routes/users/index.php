<?php

function GET () {
	$result = DB::query('user.allUsernames');

	if ($result->num_rows > 0) {
		$usernames = [];

		while($row = $result->fetch_assoc()) {
			$usernames[] = $row["username"];
		}

		View::json([
			'success' => true,
		    'usernames' => $usernames
		]);
	} else {
		View::json([
			'success' => false
		]);
	}
}

function POST () {
	if(!isset($_POST['username']) || empty($_POST['username'])) {
		View::error(400, 'Invalid or undefined parameter "id"');
	}

	$username = $_POST['username'];

	$userID = json_decode(file_get_contents(DEVRANT_API . '/get-user-id?app=3&username=' . $username));

	if($userID->success) {
		$userID = $userID->user_id;

		$user = json_decode(file_get_contents(DEVRANT_API . '/users/' . $userID . '?app=3'));

		if($user->success) {
			if($user->profile->dpp == 1) {
				View::json(['success' => false, 'error' => 'User is a devRant++ member and should be added automatically soon.']);
				return;
			}
		}

		$result = DB::query('user.exists', [
			'id' => $userID
		]);

		if($result->num_rows > 0) {
			//View::json(['success' => false, 'error' => 'User already exists']);
			//return;
		}

		$result = DB::query('user.add',  [
			'devrant_id' => $userID,
		    'username' => $user->profile->username,
		    'start_time' => 0,
			'created_time' => $user->profile->created_time,
		    'avatar_url' => (isset($user->profile->avatar_sm->i) ? $user->profile->avatar_sm->i : ''), // For users with no avatar
		    'avatar_bg' => $user->profile->avatar_sm->b,
		    'score' => $user->profile->score,
		    'rants' => $user->profile->content->counts->rants
		]);

		if($result === true) {
			View::json(['success' => true]);
		} else {
			View::json(['success' => false, 'error' => 'An error occured while performing database query.']);
		}
	} else {
		View::json(['success' => false, 'error' => 'User does not exist']);
	}
}