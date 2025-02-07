<?php

function validate ($id) {
	return is_numeric($id);
}

function GET($id) {
	$result = DB::query('user.stats', ['id' => $id]);

	if($result->num_rows > 0) {
		$stats = DB::getRows($result);

		foreach ($stats as $column => $value) {
			if (is_numeric($value)) {
				$user[$column] = intval($value);
			}
		}

		$days_recorded = $result->num_rows;

		$userstats = [];
	}
}