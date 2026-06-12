# Performance Metrics

## Validation Summary

A validation dataset consisting of scam and legitimate messages was tested against the DistilBERT-based scam detection model.

### Observations

* The model successfully identified multiple common scam patterns, including:

  * Lottery scams
  * Account verification scams
  * Password update scams
  * Promotional reward scams

* The model correctly classified most legitimate communication messages.

### Identified Issues

#### False Positive

* Utility bill notification incorrectly classified as scam.

#### False Negative

* OTP-related scam message incorrectly classified as legitimate.

### Security Assessment

The model demonstrates strong capability in detecting common phishing and social engineering attempts. However, additional training data focused on OTP-based fraud and legitimate billing notifications is recommended to improve classification accuracy.

### Recommendation

Expand the training dataset with:

* Banking OTP scams
* Government service notifications
* Utility billing messages
* E-commerce transaction alerts

to improve robustness and reduce misclassification rates.