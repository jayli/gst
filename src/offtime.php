<?php
$callback = $_GET['callback'];
if(isset($_GET['sleep'])){
	sleep($_GET['sleep']);
}
echo $callback.'(new Date("'.date("Y/m/d H:i:s").'"))';
?>
