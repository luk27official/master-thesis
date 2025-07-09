import numpy as np
from sklearn.cluster import DBSCAN


def compute_clusters(
    points: list[list[float]],
    prediction_scores: list[float],
):
    points_array = np.array(points)
    scores_array = np.array(prediction_scores).reshape(-1, 1)
    stacked = np.hstack((points_array, scores_array))

    HIGH_SCORE_THRESHOLD = 0.7

    high_score_mask = stacked[:, 3] > HIGH_SCORE_THRESHOLD
    high_score_points = stacked[high_score_mask][:, :3]

    EPS = 5.0
    MIN_SAMPLES = 3

    if len(high_score_points) < MIN_SAMPLES:
        return -1 * np.ones(len(points), dtype=int)

    dbscan = DBSCAN(eps=EPS, min_samples=MIN_SAMPLES)
    labels = dbscan.fit_predict(high_score_points)

    all_labels = -1 * np.ones(len(points), dtype=int)
    all_labels[high_score_mask] = labels
    labels = all_labels

    return labels
