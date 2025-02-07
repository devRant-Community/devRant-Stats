<?php

function validate ($id) {
	return is_numeric($id);
}

function getRank ($type, $userID) {
	$result = DB::query('user.rank', ['type' => $type]);

	if ($result->num_rows > 0) {
		$users = DB::getRows($result);

		$rank = 1;
		foreach ($users as $user) {
			if ($user["devrant_id"] == $userID) {
				return $rank;
			}

			$rank++;
		}

		return 1;
	} else {
		return false;
	}
}

function GET ($id) {
	$result = DB::query('user.info', ['id' => $id]);

	if ($result->num_rows == 1) {
		$user = $result->fetch_assoc();

		foreach ($user as $key => $value) {
			if ($key != "avatar_bg" && is_numeric($value)) {
				$user[$key] = intval($value);
			}
		}

		$user['scoreRank'] = getRank('score', $user["devrant_id"]);
		$user['rantsRank'] = getRank('rants', $user["devrant_id"]);
		$user['avatar_big_url'] = str_replace('c-3', 'c-1', $user['avatar_url']);

		View::json([
			'success' => true,
			'user'    => $user,
		]);
	} else {
		View::json([
			'success' => false,
			'error'   => 'User not found',
		]);
	}
}