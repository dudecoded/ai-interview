/**
 * Use this before navigating to the interview screen.
 * Pass the same selectedResume state already used by the Dashboard.
 */
export function canStartPractice(selectedResume, showMessage) {
  if (!selectedResume) {
    showMessage("Please upload a resume first, then start your interview.");
    return false;
  }
  showMessage("");
  return true;
}
