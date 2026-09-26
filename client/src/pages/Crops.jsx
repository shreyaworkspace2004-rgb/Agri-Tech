import { useEffect, useState } from "react";
import axios from "axios";
import { useTranslation } from "react-i18next";
import i18n from "../i18n/i18n";

function Crops() {
    const { t } = useTranslation();

    const [crops, setCrops] = useState([]);
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");

    const [editingCrop, setEditingCrop] = useState(null);
    const [selectedCrop, setSelectedCrop] = useState(null);

    const [formData, setFormData] = useState({
        cropName: "",
        cropType: "",
        area: "",
        soilType: "",
        sowingDate: "",
        expectedHarvestDate: "",
        status: "Planned",
    });

    // =========================
    // DATE LOCALE
    // =========================
    const getDateLocale = () => {
        if (i18n.language === "mr") return "mr-IN";
        if (i18n.language === "hi") return "hi-IN";
        return "en-IN";
    };

    // =========================
    // FORMAT DATE
    // =========================
    const formatDate = (date) => {
        if (!date) return "";

        const d = new Date(date);

        return d.toLocaleDateString(getDateLocale(), {
            day: "2-digit",
            month: "long",
            year: "numeric",
        });
    };

    // =========================
    // TRANSLATE STATUS
    // =========================
    const translateStatus = (status) => {
        if (status === "Planned") {
            return t("crops.planned", { defaultValue: "Planned" });
        }

        if (status === "Growing") {
            return t("crops.growing", { defaultValue: "Growing" });
        }

        if (status === "Harvested") {
            return t("crops.harvested", { defaultValue: "Harvested" });
        }

        return status;
    };

    // =========================
    // TRANSLATE SOIL TYPE
    // =========================
    const translateSoilType = (soilType) => {
        if (soilType === "Black Soil") {
            return t("crops.blackSoil", {
                defaultValue: "Black Soil",
            });
        }

        if (soilType === "Red Soil") {
            return t("crops.redSoil", {
                defaultValue: "Red Soil",
            });
        }

        if (soilType === "Alluvial Soil") {
            return t("crops.alluvialSoil", {
                defaultValue: "Alluvial Soil",
            });
        }

        if (soilType === "Laterite Soil") {
            return t("crops.lateriteSoil", {
                defaultValue: "Laterite Soil",
            });
        }

        if (soilType === "Sandy Soil") {
            return t("crops.sandySoil", {
                defaultValue: "Sandy Soil",
            });
        }

        return soilType;
    };

    // =========================
    // FETCH CROPS
    // =========================
    const fetchCrops = async () => {
        try {
            const token = localStorage.getItem("token");

            const response = await axios.get(
                "http://localhost:5000/api/crops",
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            setCrops(response.data.crops || []);
        } catch (error) {
            setError(
                error.response?.data?.message ||
                t("crops.unableToFetch", {
                    defaultValue: "Unable to fetch crops",
                })
            );
        }
    };

    useEffect(() => {
        fetchCrops();
    }, []);

    // =========================
    // HANDLE INPUT
    // =========================
    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    // =========================
    // RESET FORM
    // =========================
    const resetForm = () => {
        setFormData({
            cropName: "",
            cropType: "",
            area: "",
            soilType: "",
            sowingDate: "",
            expectedHarvestDate: "",
            status: "Planned",
        });
    };

    // =========================
    // ADD / UPDATE CROP
    // =========================
    const handleSubmit = async (e) => {
        e.preventDefault();

        setMessage("");
        setError("");

        try {
            const token = localStorage.getItem("token");

            // =========================
            // UPDATE CROP
            // =========================
            if (editingCrop) {
                const response = await axios.put(
                    `http://localhost:5000/api/crops/${editingCrop._id}`,
                    formData,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );

                setMessage(
                    response.data.message ||
                    t("crops.cropUpdated", {
                        defaultValue: "Crop updated successfully",
                    })
                );

                setEditingCrop(null);
            }

            // =========================
            // ADD CROP
            // =========================
            else {
                const response = await axios.post(
                    "http://localhost:5000/api/crops",
                    formData,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );

                setMessage(
                    response.data.message ||
                    t("crops.cropAdded", {
                        defaultValue: "Crop added successfully",
                    })
                );
            }

            // RESET FORM
            resetForm();

            // REFRESH CROP LIST
            fetchCrops();

        } catch (error) {
            setError(
                error.response?.data?.message ||
                t("crops.operationFailed", {
                    defaultValue: "Operation failed",
                })
            );
        }
    };

    // =========================
    // VIEW CROP DETAILS
    // =========================
    const handleView = (crop) => {
        setSelectedCrop(crop);
    };

    // =========================
    // CLOSE VIEW DETAILS
    // =========================
    const handleCloseView = () => {
        setSelectedCrop(null);
    };

    // =========================
    // EDIT CROP
    // =========================
    const handleEdit = (crop) => {
        setEditingCrop(crop);

        setFormData({
            cropName: crop.cropName,
            cropType: crop.cropType,
            area: crop.area,
            soilType: crop.soilType,
            sowingDate: crop.sowingDate?.slice(0, 10),
            expectedHarvestDate:
                crop.expectedHarvestDate?.slice(0, 10),
            status: crop.status,
        });

        window.scrollTo({
            top: 0,
            behavior: "smooth",
        });
    };

    // =========================
    // DELETE CROP
    // =========================
    const handleDelete = async (id) => {
        const confirmDelete = window.confirm(
            t("crops.confirmDelete", {
                defaultValue:
                    "Are you sure you want to delete this crop?",
            })
        );

        if (!confirmDelete) {
            return;
        }

        try {
            const token = localStorage.getItem("token");

            const response = await axios.delete(
                `http://localhost:5000/api/crops/${id}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            setMessage(
                response.data.message ||
                t("crops.cropDeleted", {
                    defaultValue: "Crop deleted successfully",
                })
            );

            fetchCrops();

        } catch (error) {
            setError(
                error.response?.data?.message ||
                t("crops.unableToDelete", {
                    defaultValue: "Unable to delete crop",
                })
            );
        }
    };

    // =========================
    // CANCEL EDIT
    // =========================
    const handleCancelEdit = () => {
        setEditingCrop(null);

        resetForm();

        setMessage("");
        setError("");
    };

    // =========================
    // UI
    // =========================
    return (
        <div className="container py-5">

            {/* PAGE TITLE */}
            <h1 className="text-success fw-bold mb-4">
                🌾 {t("crops.title", {
                    defaultValue: "Crop Management",
                })}
            </h1>

            {/* SUCCESS MESSAGE */}
            {message && (
                <div className="alert alert-success">
                    {message}
                </div>
            )}

            {/* ERROR MESSAGE */}
            {error && (
                <div className="alert alert-danger">
                    {error}
                </div>
            )}

            {/* =========================
                CROP FORM
            ========================= */}

            <div className="card shadow-sm p-4 mb-5">

                <h3 className="text-success mb-4">
                    {editingCrop
                        ? `✏️ ${t("crops.editCrop", {
                            defaultValue: "Edit Crop",
                        })}`
                        : `➕ ${t("crops.addNewCrop", {
                            defaultValue: "Add New Crop",
                        })}`}
                </h3>

                <form onSubmit={handleSubmit}>

                    <div className="row">

                        {/* CROP NAME */}
                        <div className="col-md-6 mb-3">

                            <label className="form-label">
                                {t("crops.cropName", {
                                    defaultValue: "Crop Name",
                                })}
                            </label>

                            <input
                                type="text"
                                name="cropName"
                                className="form-control"
                                placeholder={t(
                                    "crops.cropNamePlaceholder",
                                    {
                                        defaultValue: "e.g. Wheat",
                                    }
                                )}
                                value={formData.cropName}
                                onChange={handleChange}
                                required
                            />

                        </div>

                        {/* CROP TYPE */}
                        <div className="col-md-6 mb-3">

                            <label className="form-label">
                                {t("crops.cropType", {
                                    defaultValue: "Crop Type",
                                })}
                            </label>

                            <input
                                type="text"
                                name="cropType"
                                className="form-control"
                                placeholder={t(
                                    "crops.cropTypePlaceholder",
                                    {
                                        defaultValue: "e.g. Cereal",
                                    }
                                )}
                                value={formData.cropType}
                                onChange={handleChange}
                                required
                            />

                        </div>

                        {/* AREA */}
                        <div className="col-md-6 mb-3">

                            <label className="form-label">
                                {t("crops.area", {
                                    defaultValue: "Area (Acres)",
                                })}
                            </label>

                            <input
                                type="number"
                                step="0.1"
                                name="area"
                                className="form-control"
                                placeholder={t(
                                    "crops.areaPlaceholder",
                                    {
                                        defaultValue: "e.g. 2.5",
                                    }
                                )}
                                value={formData.area}
                                onChange={handleChange}
                                required
                            />

                        </div>

                        {/* SOIL TYPE */}
                        <div className="col-md-6 mb-3">

                            <label className="form-label">
                                {t("crops.soilType", {
                                    defaultValue: "Soil Type",
                                })}
                            </label>

                            <select
                                name="soilType"
                                className="form-select"
                                value={formData.soilType}
                                onChange={handleChange}
                                required
                            >

                                <option value="">
                                    {t("crops.selectSoilType", {
                                        defaultValue:
                                            "Select Soil Type",
                                    })}
                                </option>

                                <option value="Black Soil">
                                    {t("crops.blackSoil", {
                                        defaultValue: "Black Soil",
                                    })}
                                </option>

                                <option value="Red Soil">
                                    {t("crops.redSoil", {
                                        defaultValue: "Red Soil",
                                    })}
                                </option>

                                <option value="Alluvial Soil">
                                    {t("crops.alluvialSoil", {
                                        defaultValue:
                                            "Alluvial Soil",
                                    })}
                                </option>

                                <option value="Laterite Soil">
                                    {t("crops.lateriteSoil", {
                                        defaultValue:
                                            "Laterite Soil",
                                    })}
                                </option>

                                <option value="Sandy Soil">
                                    {t("crops.sandySoil", {
                                        defaultValue: "Sandy Soil",
                                    })}
                                </option>

                            </select>

                        </div>

                        {/* SOWING DATE */}
                        <div className="col-md-6 mb-3">

                            <label className="form-label">
                                {t("crops.sowingDate", {
                                    defaultValue: "Sowing Date",
                                })}
                            </label>

                            <input
                                type="date"
                                name="sowingDate"
                                className="form-control"
                                value={formData.sowingDate}
                                onChange={handleChange}
                                required
                            />

                        </div>

                        {/* HARVEST DATE */}
                        <div className="col-md-6 mb-3">

                            <label className="form-label">
                                {t("crops.expectedHarvestDate", {
                                    defaultValue:
                                        "Expected Harvest Date",
                                })}
                            </label>

                            <input
                                type="date"
                                name="expectedHarvestDate"
                                className="form-control"
                                value={formData.expectedHarvestDate}
                                onChange={handleChange}
                                required
                            />

                        </div>

                        {/* STATUS */}
                        <div className="col-md-6 mb-3">

                            <label className="form-label">
                                {t("crops.cropStatus", {
                                    defaultValue: "Crop Status",
                                })}
                            </label>

                            <select
                                name="status"
                                className="form-select"
                                value={formData.status}
                                onChange={handleChange}
                            >

                                <option value="Planned">
                                    {t("crops.planned", {
                                        defaultValue: "Planned",
                                    })}
                                </option>

                                <option value="Growing">
                                    {t("crops.growing", {
                                        defaultValue: "Growing",
                                    })}
                                </option>

                                <option value="Harvested">
                                    {t("crops.harvested", {
                                        defaultValue: "Harvested",
                                    })}
                                </option>

                            </select>

                        </div>

                    </div>

                    {/* SUBMIT BUTTON */}

                    <button
                        type="submit"
                        className="btn btn-success me-2"
                    >
                        {editingCrop
                            ? `💾 ${t("crops.updateCrop", {
                                defaultValue: "Update Crop",
                            })}`
                            : `🌱 ${t("crops.addCrop", {
                                defaultValue: "Add Crop",
                            })}`}
                    </button>

                    {/* CANCEL BUTTON */}

                    {editingCrop && (
                        <button
                            type="button"
                            className="btn btn-secondary"
                            onClick={handleCancelEdit}
                        >
                            {t("common.cancel", {
                                defaultValue: "Cancel",
                            })}
                        </button>
                    )}

                </form>
            </div>

            {/* =========================
                CROP LIST
            ========================= */}

            <h3 className="text-success mb-4">
                📋 {t("crops.myCrops", {
                    defaultValue: "My Crops",
                })}
            </h3>

            <div className="row">

                {crops.length === 0 ? (

                    <div className="col-12">

                        <div className="alert alert-info">
                            {t("crops.noCrops", {
                                defaultValue:
                                    "No crops added yet.",
                            })}
                        </div>

                    </div>

                ) : (

                    crops.map((crop) => (

                        <div
                            className="col-md-6 col-lg-4 mb-4"
                            key={crop._id}
                        >

                            <div className="card shadow-sm h-100">

                                <div className="card-body">

                                    {/* CROP NAME */}

                                    <h4 className="text-success">
                                        🌾 {crop.cropName}
                                    </h4>

                                    {/* DETAILS */}

                                    <p>
                                        <strong>
                                            {t("crops.type", {
                                                defaultValue:
                                                    "Type",
                                            })}:
                                        </strong>{" "}
                                        {crop.cropType}
                                    </p>

                                    <p>
                                        <strong>
                                            {t("crops.areaLabel", {
                                                defaultValue:
                                                    "Area",
                                            })}:
                                        </strong>{" "}
                                        {crop.area}{" "}
                                        {t("crops.acres", {
                                            defaultValue:
                                                "acres",
                                        })}
                                    </p>

                                    <p>
                                        <strong>
                                            {t("crops.soil", {
                                                defaultValue:
                                                    "Soil",
                                            })}:
                                        </strong>{" "}
                                        {translateSoilType(
                                            crop.soilType
                                        )}
                                    </p>

                                    <p>
                                        <strong>
                                            {t("crops.sowing", {
                                                defaultValue:
                                                    "Sowing",
                                            })}:
                                        </strong>{" "}
                                        {formatDate(
                                            crop.sowingDate
                                        )}
                                    </p>

                                    <p>
                                        <strong>
                                            {t("crops.harvest", {
                                                defaultValue:
                                                    "Harvest",
                                            })}:
                                        </strong>{" "}
                                        {formatDate(
                                            crop.expectedHarvestDate
                                        )}
                                    </p>

                                    {/* STATUS */}

                                    <span className="badge bg-success">
                                        {translateStatus(
                                            crop.status
                                        )}
                                    </span>

                                    {/* BUTTONS */}

                                    <div className="mt-3">

                                        {/* VIEW */}

                                        <button
                                            type="button"
                                            className="btn btn-info btn-sm me-2"
                                            onClick={() =>
                                                handleView(crop)
                                            }
                                        >
                                            👁️{" "}
                                            {t("crops.view", {
                                                defaultValue:
                                                    "View",
                                            })}
                                        </button>

                                        {/* EDIT */}

                                        <button
                                            type="button"
                                            className="btn btn-warning btn-sm me-2"
                                            onClick={() =>
                                                handleEdit(crop)
                                            }
                                        >
                                            ✏️{" "}
                                            {t("crops.edit", {
                                                defaultValue:
                                                    "Edit",
                                            })}
                                        </button>

                                        {/* DELETE */}

                                        <button
                                            type="button"
                                            className="btn btn-danger btn-sm"
                                            onClick={() =>
                                                handleDelete(
                                                    crop._id
                                                )
                                            }
                                        >
                                            🗑️{" "}
                                            {t("crops.delete", {
                                                defaultValue:
                                                    "Delete",
                                            })}
                                        </button>

                                    </div>

                                </div>

                            </div>

                        </div>

                    ))

                )}

            </div>

            {/* =========================
                VIEW DETAILS MODAL
            ========================= */}

            {selectedCrop && (

                <div
                    className="modal fade show d-block"
                    tabIndex="-1"
                    style={{
                        backgroundColor:
                            "rgba(0, 0, 0, 0.6)",
                    }}
                >

                    <div className="modal-dialog modal-dialog-centered">

                        <div className="modal-content">

                            {/* MODAL HEADER */}

                            <div className="modal-header bg-success text-white">

                                <h5 className="modal-title">
                                    🌾{" "}
                                    {t("crops.cropDetails", {
                                        defaultValue:
                                            "Crop Details",
                                    })}
                                </h5>

                                <button
                                    type="button"
                                    className="btn-close btn-close-white"
                                    onClick={handleCloseView}
                                ></button>

                            </div>

                            {/* MODAL BODY */}

                            <div className="modal-body">

                                <h3 className="text-success text-center mb-4">
                                    🌱{" "}
                                    {selectedCrop.cropName}
                                </h3>

                                <div className="row">

                                    <div className="col-6 mb-3">

                                        <strong>
                                            {t(
                                                "crops.cropType",
                                                {
                                                    defaultValue:
                                                        "Crop Type",
                                                }
                                            )}
                                        </strong>

                                        <br />

                                        {selectedCrop.cropType}

                                    </div>

                                    <div className="col-6 mb-3">

                                        <strong>
                                            {t(
                                                "crops.areaLabel",
                                                {
                                                    defaultValue:
                                                        "Area",
                                                }
                                            )}
                                        </strong>

                                        <br />

                                        {selectedCrop.area}{" "}
                                        {t("crops.acres", {
                                            defaultValue:
                                                "acres",
                                        })}

                                    </div>

                                    <div className="col-6 mb-3">

                                        <strong>
                                            {t(
                                                "crops.soilType",
                                                {
                                                    defaultValue:
                                                        "Soil Type",
                                                }
                                            )}
                                        </strong>

                                        <br />

                                        {translateSoilType(
                                            selectedCrop.soilType
                                        )}

                                    </div>

                                    <div className="col-6 mb-3">

                                        <strong>
                                            {t(
                                                "crops.cropStatus",
                                                {
                                                    defaultValue:
                                                        "Status",
                                                }
                                            )}
                                        </strong>

                                        <br />

                                        <span className="badge bg-success">
                                            {translateStatus(
                                                selectedCrop.status
                                            )}
                                        </span>

                                    </div>

                                    <div className="col-6 mb-3">

                                        <strong>
                                            {t(
                                                "crops.sowingDate",
                                                {
                                                    defaultValue:
                                                        "Sowing Date",
                                                }
                                            )}
                                        </strong>

                                        <br />

                                        {formatDate(
                                            selectedCrop.sowingDate
                                        )}

                                    </div>

                                    <div className="col-6 mb-3">

                                        <strong>
                                            {t(
                                                "crops.expectedHarvestDate",
                                                {
                                                    defaultValue:
                                                        "Expected Harvest",
                                                }
                                            )}
                                        </strong>

                                        <br />

                                        {formatDate(
                                            selectedCrop.expectedHarvestDate
                                        )}

                                    </div>

                                </div>

                            </div>

                            {/* MODAL FOOTER */}

                            <div className="modal-footer">

                                <button
                                    type="button"
                                    className="btn btn-secondary"
                                    onClick={handleCloseView}
                                >
                                    {t("common.close", {
                                        defaultValue:
                                            "Close",
                                    })}
                                </button>

                                <button
                                    type="button"
                                    className="btn btn-warning"
                                    onClick={() => {
                                        handleEdit(
                                            selectedCrop
                                        );
                                        handleCloseView();
                                    }}
                                >
                                    ✏️{" "}
                                    {t("crops.editCrop", {
                                        defaultValue:
                                            "Edit Crop",
                                    })}
                                </button>

                            </div>

                        </div>

                    </div>

                </div>

            )}

        </div>
    );
}

export default Crops;