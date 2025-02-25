const router = require('express').Router();
const tf = require("@tensorflow/tfjs-node");

router.post("/train", async (req, res) => {
    try {
        const { input, output } = req.body;

        // Convert data to tensors
        const inputTensor = tf.tensor2d(input, [input.length, input[0].length]);
        const outputTensor = tf.tensor2d(output, [output.length, output[0].length]);

        // Define a simple neural network model
        const model = tf.sequential();
        model.add(tf.layers.dense({ units: 10, inputShape: [input[0].length], activation: "relu" }));
        model.add(tf.layers.dense({ units: output[0].length, activation: "softmax" }));

        model.compile({
            optimizer: "adam",
            loss: "categoricalCrossentropy",
            metrics: ["accuracy"],
        });

        // Train the model
        await model.fit(inputTensor, outputTensor, {
            epochs: 50,
            batchSize: 10,
        });

        // Save the trained model
        await model.save("file://./trained-model");

        res.json({ message: "Model trained successfully!" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Load and Predict using the trained model
router.post("/predict", async (req, res) => {
    try {
        const model = await tf.loadLayersModel("file://./trained-model/model.json");
        const inputTensor = tf.tensor2d([req.body.input], [1, req.body.input.length]);
        const prediction = model.predict(inputTensor);
        const output = await prediction.array();

        res.json({ prediction: output });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;