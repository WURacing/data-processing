var express = require('express');
const importFile = require('../parser');
var router = express.Router();
const { promisify } = require('util');

function loadRunDetails(req, run) {
	const getAsync = promisify(req.db.get).bind(req.db);
	let result = { id: run };
	return getAsync(`run:${run}:date`)
		.then((datestr) => { result.date = parseInt(datestr) })
		.then(() => getAsync(`run:${run}:location`))
		.then((location) => { result.location = location })
		.then(() => getAsync(`run:${run}:runofday`))
		.then((runofday) => { result.runofday = parseInt(runofday) })
		.then(() => result)
}

// Get listing of all runs
router.get('/', function (req, res) {
	const smembersAsync = promisify(req.db.smembers).bind(req.db);
	smembersAsync("runs")
		.then((runs) => Promise.all(runs.map(run => loadRunDetails(req, run))))
		.then((results) => {
			res.status(200).send(results)
		})
		.catch((error) => {
			res.status(500).send({ error })
		});
});

// Upload a new run log file
router.post('/', function (req, res) {
	const setAsync = promisify(req.db.set).bind(req.db);
	importFile(req.files.file.path, req.db)
		.then((id) => setAsync(`run:${id}:location`, req.fields.location)
			.then(() => setAsync(`run:${id}:runofday`, req.fields.runofday))
			.then(() => {
				res.status(201).location(`/api/runs/${id}`).send({ id });
			}))
		.catch((error) => {
			res.status(500).send({ error });
		});
});

// Get details on a particular run
router.get("/:runId", function (req, res) {
	const smembersAsync = promisify(req.db.smembers).bind(req.db);
	const hgetallAsync = promisify(req.db.hgetall).bind(req.db);
	loadRunDetails(req, req.params.runId)
		.then((result) => smembersAsync(`run:${req.params.runId}:data`)
			.then((timestamps) => Promise.all(timestamps.map(ts => hgetallAsync(`run:${req.params.runId}:data:${ts}`))))
			.then((results) => {
				result.data = results;
				res.status(200).send(result)
			}))
		.catch((error) => {
			res.status(500).send({ error });
		})
});

// Delete a run
router.delete("/:runId", (req, res) => {
	let id = parseInt(req.params.runId);
	if (isNaN(id) || id < 0) {
		return res.status(400).send({ error: "Invalid ID" })
	}

	const srem = promisify(req.db.srem).bind(req.db);

	srem("runs", id) // TODO actually delete data
		.then(() => {
			res.status(200).send({ id });
		})
		.catch((error) => {
			res.status(500).send({ error });
		})
});

module.exports = router;
