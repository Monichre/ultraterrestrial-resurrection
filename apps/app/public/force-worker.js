const worker = new Worker("./forceWorker.js");

function useWebWorkerLayout() {
	const [nodes, setNodes] = useState([]);

	useEffect(() => {
		worker.onmessage = (e) => setNodes(e.data);
		worker.postMessage({ nodes, edges });

		return () => worker.terminate();
	}, [nodes, edges]);

	return nodes;
}

// forceWorker.js
self.onmessage = ({ data }) => {
	const simulation = forceSimulation(data.nodes)
		.force("link", forceLink(data.edges))
		.stop();

	for (let i = 0; i < 300; i++) simulation.tick();
	self.postMessage(simulation.nodes());
};
