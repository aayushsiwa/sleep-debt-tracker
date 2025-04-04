export const logout = (req, res) => {
  res.cookie("token", "", { expires: new Date(0), httpOnly: true, sameSite: "Strict" });
  res.status(200).json({ message: "Logged out successfully" });
};
