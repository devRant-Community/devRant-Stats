<?php

function GET() {
	$result = DB::query('stats.global');

	if($result->num_rows > 0) {
		$globalStats = $result->fetch_assoc();

		foreach ($globalStats as $key => $value) {
			if (is_numeric($value)) {
				$globalStats[$key] = intval($value);
			}
		}

		View::json(['success' => true, 'stats' => $globalStats]);
	}
}