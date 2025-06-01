import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { useSelector } from "react-redux";
import axiosClient from "../utils/axiosClient";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { ChevronLeft } from "lucide-react";
const AdminPanel = () => {
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  const [activeTab, setActiveTab] = useState("create");
  const [problems, setProblems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [formSubmitting, setFormSubmitting] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [currentProblemId, setCurrentProblemId] = useState(null);

  // Form state
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    difficulty: "easy",
    tags: "array",
    visibleTestCases: [{ input: "", output: "", explanation: "" }],
    hiddenTestCases: [{ input: "", output: "" }],
    startCode: [{ language: "javascript", initialCode: "// Your code here" }],
    referenceSolution: [
      { language: "javascript", completeCode: "// Complete solution here" },
    ],
  });

  // Handle input changes for basic form fields
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  // Handle changes for nested array fields
  const handleArrayFieldChange = (arrayName, index, fieldName, value) => {
    const updatedArray = [...formData[arrayName]];
    updatedArray[index] = {
      ...updatedArray[index],
      [fieldName]: value,
    };

    setFormData({
      ...formData,
      [arrayName]: updatedArray,
    });
  };

  // Add new item to array fields
  const addArrayItem = (arrayName, defaultItem) => {
    setFormData({
      ...formData,
      [arrayName]: [...formData[arrayName], defaultItem],
    });
  };

  // Remove item from array fields
  const removeArrayItem = (arrayName, index) => {
    const updatedArray = [...formData[arrayName]];
    updatedArray.splice(index, 1);

    setFormData({
      ...formData,
      [arrayName]: updatedArray,
    });
  };

  // Reset form data
  const resetForm = () => {
    setFormData({
      title: "",
      description: "",
      difficulty: "easy",
      tags: "array",
      visibleTestCases: [{ input: "", output: "", explanation: "" }],
      hiddenTestCases: [{ input: "", output: "" }],
      startCode: [{ language: "javascript", initialCode: "// Your code here" }],
      referenceSolution: [
        { language: "javascript", completeCode: "// Complete solution here" },
      ],
    });
    setEditMode(false);
    setCurrentProblemId(null);
  };

  // Fetch all problems for admin
  useEffect(() => {
    if (activeTab === "manage") {
      fetchProblems();
    }
  }, [activeTab]);

  const fetchProblems = async () => {
    try {
      setLoading(true);
      const response = await axiosClient.get("/problem");
      setProblems(response.data.problems || []);
    } catch (error) {
      console.error("Error fetching problems:", error);
      toast.error("Failed to load problems");
    } finally {
      setLoading(false);
    }
  };

  // Load problem data for editing
  const handleEditProblem = async (id) => {
    try {
      setLoading(true);
      const response = await axiosClient.get(`/problem/${id}`);
      const problem = response.data.dsaProblem;

      // Set form data with problem details
      setFormData({
        title: problem.title,
        description: problem.description,
        difficulty: problem.difficulty,
        tags: problem.tags,
        visibleTestCases: problem.visibleTestCases,
        hiddenTestCases: problem.hiddenTestCases,
        startCode: problem.startCode,
        referenceSolution: problem.referenceSolution,
      });

      setEditMode(true);
      setCurrentProblemId(id);
      setActiveTab("create"); // Switch to create tab for editing
    } catch (error) {
      console.error("Error fetching problem details:", error);
      toast.error("Failed to load problem details");
    } finally {
      setLoading(false);
    }
  };

  // Update existing problem
  const handleUpdateProblem = async () => {
    try {
      setFormSubmitting(true);

      // Normalize language case to lowercase
      const formattedData = {
        ...formData,
        referenceSolution: formData.referenceSolution.map((sol) => ({
          ...sol,
          language:
            sol.language === "cpp" || sol.language === "C++"
              ? "c++"
              : sol.language.toLowerCase(),
        })),
        startCode: formData.startCode.map((code) => ({
          ...code,
          language:
            code.language === "cpp" || code.language === "C++"
              ? "c++"
              : code.language.toLowerCase(),
        })),
      };

      const response = await axiosClient.patch(
        `/problem/${currentProblemId}`,
        formattedData
      );

      if (response.status === 200) {
        toast.success("Problem updated successfully!");
        resetForm();
        setActiveTab("manage");
      }
    } catch (error) {
      console.error("Error updating problem:", error);
      const errorMessage =
        error.response?.data?.message ||
        error.response?.data?.error ||
        error.message ||
        "Failed to update problem";
      toast.error(errorMessage);
    } finally {
      setFormSubmitting(false);
    }
  };

  // Submit form to create or update a problem
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate form
    if (!formData.title || !formData.description) {
      toast.error("Title and description are required");
      return;
    }

    if (
      formData.visibleTestCases.some(
        (tc) => !tc.input || !tc.output || !tc.explanation
      )
    ) {
      toast.error(
        "All visible test cases must have input, output, and explanation"
      );
      return;
    }

    if (formData.hiddenTestCases.some((tc) => !tc.input || !tc.output)) {
      toast.error("All hidden test cases must have input and output");
      return;
    }

    if (formData.referenceSolution.some((sol) => !sol.completeCode)) {
      toast.error("All reference solutions must have complete code");
      return;
    }

    // If in edit mode, update the problem, otherwise create a new one
    if (editMode) {
      await handleUpdateProblem();
    } else {
      try {
        setFormSubmitting(true);

        // Normalize language case to lowercase
        const formattedData = {
          ...formData,
          referenceSolution: formData.referenceSolution.map((sol) => ({
            ...sol,
            language:
              sol.language === "cpp" || sol.language === "C++"
                ? "c++"
                : sol.language.toLowerCase(),
          })),
          startCode: formData.startCode.map((code) => ({
            ...code,
            language:
              code.language === "cpp" || code.language === "C++"
                ? "c++"
                : code.language.toLowerCase(),
          })),
        };

        console.log("Submitting problem data:", formattedData);

        const response = await axiosClient.post(
          "/problem/create",
          formattedData
        );

        if (response.status === 200) {
          toast.success("Problem created successfully!");
          resetForm();
        }
      } catch (error) {
        console.error("Error creating problem:", error);

        const errorMessage =
          error.response?.data?.message ||
          error.response?.data?.error ||
          error.message ||
          "Failed to create problem";

        const errorDetails = error.response?.data?.details;

        if (errorDetails) {
          console.error("Error details:", errorDetails);
        }

        toast.error(errorMessage);
      } finally {
        setFormSubmitting(false);
      }
    }
  };

  // Delete a problem
  const handleDeleteProblem = async (id) => {
    if (!window.confirm("Are you sure you want to delete this problem?")) {
      return;
    }

    try {
      await axiosClient.delete(`/problem/${id}`);
      toast.success("Problem deleted successfully");
      fetchProblems();
    } catch (error) {
      console.error("Error deleting problem:", error);
      toast.error("Failed to delete problem");
    }
  };

  // Check if user is admin
  if (user?.role !== "admin") {
    return (
      <div
        className="min-h-screen bg-base-200 flex items-center justify-center"
        data-theme="dark"
      >
        <div className="card bg-base-100 shadow-xl">
          <div className="card-body">
            <h2 className="card-title text-error">Access Denied</h2>
            <p>You don't have permission to access this page.</p>
            <div className="card-actions justify-end">
              <button className="btn btn-primary" onClick={() => navigate("/")}>
                Go Home
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-base-200" data-theme="dark">
      <ToastContainer position="top-right" theme="dark" />

      {/* Navbar */}
      <div className="navbar bg-base-100 shadow-lg">
        <div className="flex-1">
          <a
            onClick={() => navigate("/")}
            className="btn btn-ghost text-xl text-primary cursor-pointer"
          >
            LeetCode Clone
          </a>
          <span className="text-sm font-semibold bg-primary text-white px-2 py-1 rounded-md ml-2">
            Admin Panel
          </span>
        </div>
        <div className="flex-none gap-2">
          <div className="dropdown dropdown-end">
            <div
              tabIndex={0}
              role="button"
              className="btn btn-ghost btn-circle avatar"
            >
              <div className="w-10 rounded-full bg-primary text-white flex items-center justify-center">
                <span className="text-2xl font-bold">
                  {user?.firstName?.charAt(0) || "A"}
                </span>
              </div>
            </div>
            <ul
              tabIndex={0}
              className="mt-3 z-[1] p-2 shadow menu menu-sm dropdown-content bg-base-100 rounded-box w-52"
            >
              <li>
                <button onClick={() => navigate("/profile")}>Profile</button>
              </li>
              <li>
                <button onClick={() => navigate("/")}>Dashboard</button>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>
          <ChevronLeft onClick={() => navigate("/")} className="cursor-pointer w-12 h-12 hover:bg-black"></ChevronLeft>
        </div>

        {/* Tabs */}
        <div className="tabs tabs-boxed mb-6">
          <a
            className={`tab ${activeTab === "create" ? "tab-active" : ""}`}
            onClick={() => setActiveTab("create")}
          >
            Create Problem
          </a>
          <a
            className={`tab ${activeTab === "manage" ? "tab-active" : ""}`}
            onClick={() => setActiveTab("manage")}
          >
            Manage Problems
          </a>
        </div>

        {/* Create Problem Form */}
        {activeTab === "create" && (
          <div className="card bg-base-100 shadow-xl">
            <div className="card-body">
              <h2 className="card-title text-2xl mb-4">
                {editMode ? "Edit Problem" : "Create New Problem"}
              </h2>

              <form onSubmit={handleSubmit}>
                {/* Basic Info */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  <div className="form-control">
                    <label className="label">
                      <span className="label-text">Title</span>
                    </label>
                    <input
                      type="text"
                      name="title"
                      value={formData.title}
                      onChange={handleInputChange}
                      placeholder="Problem Title"
                      className="input input-bordered w-full"
                      required
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="form-control">
                      <label className="label">
                        <span className="label-text">Difficulty</span>
                      </label>
                      <select
                        name="difficulty"
                        value={formData.difficulty}
                        onChange={handleInputChange}
                        className="select select-bordered w-full"
                      >
                        <option value="easy">Easy</option>
                        <option value="medium">Medium</option>
                        <option value="hard">Hard</option>
                      </select>
                    </div>

                    <div className="form-control">
                      <label className="label">
                        <span className="label-text">Tags</span>
                      </label>
                      <select
                        name="tags"
                        value={formData.tags}
                        onChange={handleInputChange}
                        className="select select-bordered w-full"
                      >
                        <option value="array">Array</option>
                        <option value="linkedList">Linked List</option>
                        <option value="graph">Graph</option>
                        <option value="dp">Dynamic Programming</option>
                        <option value="math">Math</option>
                      </select>
                    </div>
                  </div>
                </div>

                <div className="form-control mb-6">
                  <label className="label">
                    <span className="label-text">Description</span>
                  </label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    placeholder="Problem description with examples and constraints"
                    className="textarea textarea-bordered h-32"
                    required
                  ></textarea>
                </div>

                {/* Visible Test Cases */}
                <div className="mb-6">
                  <div className="flex justify-between items-center mb-2">
                    <h3 className="text-lg font-semibold">
                      Visible Test Cases
                    </h3>
                    <button
                      type="button"
                      className="btn btn-sm btn-outline"
                      onClick={() =>
                        addArrayItem("visibleTestCases", {
                          input: "",
                          output: "",
                          explanation: "",
                        })
                      }
                    >
                      Add Test Case
                    </button>
                  </div>

                  {formData.visibleTestCases.map((testCase, index) => (
                    <div
                      key={`visible-${index}`}
                      className="card bg-base-200 p-4 mb-4"
                    >
                      <div className="flex justify-between items-center mb-2">
                        <h4 className="font-medium">Test Case #{index + 1}</h4>
                        <button
                          type="button"
                          className="btn btn-sm btn-error btn-outline"
                          onClick={() =>
                            removeArrayItem("visibleTestCases", index)
                          }
                        >
                          Remove
                        </button>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="form-control">
                          <label className="label">
                            <span className="label-text">Input</span>
                          </label>
                          <textarea
                            value={testCase.input}
                            onChange={(e) =>
                              handleArrayFieldChange(
                                "visibleTestCases",
                                index,
                                "input",
                                e.target.value
                              )
                            }
                            placeholder="Test case input"
                            className="textarea textarea-bordered h-24"
                            required
                          ></textarea>
                        </div>

                        <div className="form-control">
                          <label className="label">
                            <span className="label-text">Output</span>
                          </label>
                          <textarea
                            value={testCase.output}
                            onChange={(e) =>
                              handleArrayFieldChange(
                                "visibleTestCases",
                                index,
                                "output",
                                e.target.value
                              )
                            }
                            placeholder="Expected output"
                            className="textarea textarea-bordered h-24"
                            required
                          ></textarea>
                        </div>

                        <div className="form-control">
                          <label className="label">
                            <span className="label-text">Explanation</span>
                          </label>
                          <textarea
                            value={testCase.explanation}
                            onChange={(e) =>
                              handleArrayFieldChange(
                                "visibleTestCases",
                                index,
                                "explanation",
                                e.target.value
                              )
                            }
                            placeholder="Explanation of the test case"
                            className="textarea textarea-bordered h-24"
                            required
                          ></textarea>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Hidden Test Cases */}
                <div className="mb-6">
                  <div className="flex justify-between items-center mb-2">
                    <h3 className="text-lg font-semibold">Hidden Test Cases</h3>
                    <button
                      type="button"
                      className="btn btn-sm btn-outline"
                      onClick={() =>
                        addArrayItem("hiddenTestCases", {
                          input: "",
                          output: "",
                        })
                      }
                    >
                      Add Test Case
                    </button>
                  </div>

                  {formData.hiddenTestCases.map((testCase, index) => (
                    <div
                      key={`hidden-${index}`}
                      className="card bg-base-200 p-4 mb-4"
                    >
                      <div className="flex justify-between items-center mb-2">
                        <h4 className="font-medium">Test Case #{index + 1}</h4>
                        <button
                          type="button"
                          className="btn btn-sm btn-error btn-outline"
                          onClick={() =>
                            removeArrayItem("hiddenTestCases", index)
                          }
                        >
                          Remove
                        </button>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="form-control">
                          <label className="label">
                            <span className="label-text">Input</span>
                          </label>
                          <textarea
                            value={testCase.input}
                            onChange={(e) =>
                              handleArrayFieldChange(
                                "hiddenTestCases",
                                index,
                                "input",
                                e.target.value
                              )
                            }
                            placeholder="Test case input"
                            className="textarea textarea-bordered h-24"
                            required
                          ></textarea>
                        </div>

                        <div className="form-control">
                          <label className="label">
                            <span className="label-text">Output</span>
                          </label>
                          <textarea
                            value={testCase.output}
                            onChange={(e) =>
                              handleArrayFieldChange(
                                "hiddenTestCases",
                                index,
                                "output",
                                e.target.value
                              )
                            }
                            placeholder="Expected output"
                            className="textarea textarea-bordered h-24"
                            required
                          ></textarea>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Starter Code Templates */}
                <div className="mb-6">
                  <div className="flex justify-between items-center mb-2">
                    <h3 className="text-lg font-semibold">
                      Starter Code Templates
                    </h3>
                    <button
                      type="button"
                      className="btn btn-sm btn-outline"
                      onClick={() =>
                        addArrayItem("startCode", {
                          language: "javascript",
                          initialCode: "// Your code here",
                        })
                      }
                    >
                      Add Template
                    </button>
                  </div>

                  {formData.startCode.map((template, index) => (
                    <div
                      key={`starter-${index}`}
                      className="card bg-base-200 p-4 mb-4"
                    >
                      <div className="flex justify-between items-center mb-2">
                        <h4 className="font-medium">Template #{index + 1}</h4>
                        <button
                          type="button"
                          className="btn btn-sm btn-error btn-outline"
                          onClick={() => removeArrayItem("startCode", index)}
                        >
                          Remove
                        </button>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-2">
                        <div className="form-control">
                          <label className="label">
                            <span className="label-text">Language</span>
                          </label>
                          <select
                            value={template.language}
                            onChange={(e) =>
                              handleArrayFieldChange(
                                "startCode",
                                index,
                                "language",
                                e.target.value
                              )
                            }
                            className="select select-bordered w-full"
                          >
                            <option value="javascript">JavaScript</option>
                            <option value="python">Python</option>
                            <option value="java">Java</option>
                            <option value="cpp">C++</option>
                          </select>
                        </div>
                      </div>

                      <div className="form-control">
                        <label className="label">
                          <span className="label-text">Initial Code</span>
                        </label>
                        <textarea
                          value={template.initialCode}
                          onChange={(e) =>
                            handleArrayFieldChange(
                              "startCode",
                              index,
                              "initialCode",
                              e.target.value
                            )
                          }
                          placeholder="Starter code for this language"
                          className="textarea textarea-bordered h-32 font-mono"
                          required
                        ></textarea>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Reference Solutions */}
                <div className="mb-6">
                  <div className="flex justify-between items-center mb-2">
                    <h3 className="text-lg font-semibold">
                      Reference Solutions
                    </h3>
                    <button
                      type="button"
                      className="btn btn-sm btn-outline"
                      onClick={() =>
                        addArrayItem("referenceSolution", {
                          language: "javascript",
                          completeCode: "// Complete solution here",
                        })
                      }
                    >
                      Add Solution
                    </button>
                  </div>

                  {formData.referenceSolution.map((solution, index) => (
                    <div
                      key={`solution-${index}`}
                      className="card bg-base-200 p-4 mb-4"
                    >
                      <div className="flex justify-between items-center mb-2">
                        <h4 className="font-medium">Solution #{index + 1}</h4>
                        <button
                          type="button"
                          className="btn btn-sm btn-error btn-outline"
                          onClick={() =>
                            removeArrayItem("referenceSolution", index)
                          }
                        >
                          Remove
                        </button>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-2">
                        <div className="form-control">
                          <label className="label">
                            <span className="label-text">Language</span>
                          </label>
                          <select
                            value={solution.language}
                            onChange={(e) =>
                              handleArrayFieldChange(
                                "referenceSolution",
                                index,
                                "language",
                                e.target.value
                              )
                            }
                            className="select select-bordered w-full"
                          >
                            <option value="javascript">JavaScript</option>
                            <option value="c++">C++</option>
                            <option value="java">Java</option>
                            <option value="python">Python</option>
                            <option value="c">C</option>
                          </select>
                        </div>
                      </div>

                      <div className="form-control">
                        <label className="label">
                          <span className="label-text">Complete Solution</span>
                        </label>
                        <textarea
                          value={solution.completeCode}
                          onChange={(e) =>
                            handleArrayFieldChange(
                              "referenceSolution",
                              index,
                              "completeCode",
                              e.target.value
                            )
                          }
                          placeholder="Complete working solution"
                          className="textarea textarea-bordered h-48 font-mono"
                          required
                        ></textarea>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Submit Button */}
                <div className="card-actions justify-end mt-6">
                  {editMode && (
                    <button
                      type="button"
                      className="btn btn-outline"
                      onClick={resetForm}
                      disabled={formSubmitting}
                    >
                      Cancel
                    </button>
                  )}
                  <button
                    type="submit"
                    className="btn btn-primary"
                    disabled={formSubmitting}
                  >
                    {formSubmitting ? (
                      <>
                        <span className="loading loading-spinner"></span>
                        {editMode ? "Updating..." : "Creating..."}
                      </>
                    ) : editMode ? (
                      "Update Problem"
                    ) : (
                      "Create Problem"
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Manage Problems */}
        {activeTab === "manage" && (
          <div className="card bg-base-100 shadow-xl">
            <div className="card-body">
              <h2 className="card-title text-2xl mb-4">Manage Problems</h2>

              {loading ? (
                <div className="flex justify-center my-8">
                  <div className="loading loading-spinner loading-lg text-primary"></div>
                </div>
              ) : problems.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="table w-full">
                    <thead>
                      <tr>
                        <th>ID</th>
                        <th>Title</th>
                        <th>Difficulty</th>
                        <th>Tags</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {problems.map((problem, index) => (
                        <tr key={problem._id} className="hover">
                          <td>{index + 1}</td>
                          <td>{problem.title}</td>
                          <td>
                            <span
                              className={`badge ${
                                problem.difficulty === "easy"
                                  ? "badge-success"
                                  : problem.difficulty === "medium"
                                  ? "badge-warning"
                                  : "badge-error"
                              }`}
                            >
                              {problem.difficulty}
                            </span>
                          </td>
                          <td>
                            <span className="badge badge-outline">
                              {problem.tags}
                            </span>
                          </td>
                          <td>
                            <div className="flex gap-2">
                              <button
                                className="btn btn-sm btn-primary"
                                onClick={() =>
                                  navigate(`/problem/${problem._id}`)
                                }
                              >
                                View
                              </button>
                              <button
                                className="btn btn-sm btn-secondary"
                                onClick={() => handleEditProblem(problem._id)}
                              >
                                Edit
                              </button>
                              <button
                                className="btn btn-sm btn-error"
                                onClick={() => handleDeleteProblem(problem._id)}
                              >
                                Delete
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="alert alert-info">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    className="stroke-current shrink-0 w-6 h-6"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    ></path>
                  </svg>
                  <span>No problems found. Create some problems first!</span>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminPanel;
