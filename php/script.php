<?php

require __DIR__ . "/CoordinatesValidator.php";
require __DIR__ . "/AreaChecker.php";

const table = "<table id='outputTable'>
        <tr>
            <th>x</th>
            <th>y</th>
            <th>r</th>
            <th>Точка входит в ОДЗ</th>
            <th>Текущее время</th>
            <th>Время работы скрипта</th>
        </tr>";

@session_start();

if (!isset($_SESSION["results"])) {
    $_SESSION["results"] = array();
}

if ($_SERVER["REQUEST_METHOD"] !== "GET") {
    http_response_code(405);
    return;
}

date_default_timezone_set($_GET["timezone"]);

$x = (float)$_GET["x"];
$y = (float)$_GET["y"];
$r = (float)$_GET["r"];

$validator = new CoordinatesValidator($x, $y, $r);
if (!$validator->checkData()) {
    http_response_code(422);
    return;
}
$isInArea = AreaChecker::isInArea($x, $y, $r);
$coordinateStatus = $isInArea
    ? "<span>Попал</span>"
    : "<span>Промазал</span>";

$currentTime = date('Y-m-d H:i:s');
$benchmarkTime = microtime(true) - $_SERVER["REQUEST_TIME_FLOAT"];

$newResult = array(
    "x" => $x,
    "y" => $y,
    "r" => $r,
    "coordinatesStatus" => $coordinateStatus,
    "currentTime" => $currentTime,
    "benchmarkTime" => $benchmarkTime
);

$_SESSION["results"][] = $newResult;

echo table;

foreach (array_reverse($_SESSION["results"]) as $tableRow) {
    echo "<tr>";
    echo "<td>" . $tableRow["x"] . "</td>";
    echo "<td>" . $tableRow["y"] . "</td>";
    echo "<td>" . $tableRow["r"] . "</td>";
    echo "<td>" . $tableRow["coordinatesStatus"] . "</td>";
    echo "<td>" . $tableRow["currentTime"] . "</td>";
    echo "<td>" . $tableRow["benchmarkTime"] . "</td>";
    echo "</tr>";
}
echo "</table>";