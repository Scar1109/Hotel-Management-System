import React, { useState, useEffect } from "react";
import { Modal, Button, Select, DatePicker, Table, message, Spin } from "antd";
import moment from "moment";
import axios from "axios";

const { Option } = Select;
const { RangePicker } = DatePicker;

function MealPlanner({ visible, onClose, customerID, }) {
  const [dateRange, setDateRange] = useState([]);
  const [mealPlan, setMealPlan] = useState([]);
  const [meals, setMeals] = useState([]);
  const [loading, setLoading] = useState(false);
  const [fetchingPlan, setFetchingPlan] = useState(false);

  useEffect(() => {
    if (visible && customerID) {
      fetchExistingMealPlan();
    }
  }, [visible, customerID]);
  useEffect(() => {
    console.log("Mealssss received:", meals);  // Log the meals data to check its structure and contents
}, [meals]);

  const fetchExistingMealPlan = async () => {
    setFetchingPlan(true);
    try {
      const response = await axios.get(`/api/order/mealPlan/${customerID}`);
      if (response.data && response.data.mealPlan) {
        setMealPlan(response.data.mealPlan);
        setMeals(response.data.meals);
        if (response.data.mealPlan.length > 0) {
          setDateRange([
            moment(response.data.mealPlan[0].date),
            moment(
              response.data.mealPlan[response.data.mealPlan.length - 1].date
            ),
          ]);
        }
      } else {
        setMealPlan([]);
        setDateRange([]);
        setMeals(response.data.meals);
      }
    } catch (error) {
      console.error("Error fetching existing meal plan:", error);
      message.error("Failed to fetch existing meal plan. Please try again.");
      setMealPlan([]);
      setDateRange([]);
      setMeals([]);
    } finally {
      setFetchingPlan(false);
    }
  };

  const handleDateRangeChange = (dates) => {
    if (dates && dates.length === 2) {
      const start = moment(dates[0]);
      const end = moment(dates[1]);
      const range = [];
      let current = start.clone();

      while (current.isSameOrBefore(end)) {
        const existingDay = mealPlan.find(
          (day) => day.date === current.format("YYYY-MM-DD")
        );
        range.push(
          existingDay || {
            date: current.format("YYYY-MM-DD"),
            breakfast: "",
            lunch: "",
            dinner: "",
          }
        );
        current.add(1, "days");
      }

      setDateRange(dates);
      setMealPlan(range);
    }
  };

  const handleMealSelection = (date, mealType, mealId) => {
    setMealPlan((prevPlan) =>
      prevPlan.map((day) =>
        day.date === date ? { ...day, [mealType]: mealId } : day
      )
    );
  };

  const handleSavePlan = async () => {
    setLoading(true);
    try {
      await axios.post("/api/order/mealPlan", {
        customerID,
        mealPlan,
      });
      message.success("Meal plan saved successfully!");
      onClose();
    } catch (error) {
      console.error("Error saving meal plan:", error);
      message.error("Failed to save meal plan. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const columns = [
    {
      title: "Date",
      dataIndex: "date",
      key: "date",
      render: (text) => moment(text).format("YYYY-MM-DD"),
    },
    {
      title: "Breakfast",
      dataIndex: "breakfast",
      key: "breakfast",
      render: (value, record) => (
        <Select
          style={{ width: 120 }}
          onChange={(value) =>
            handleMealSelection(record.date, "breakfast", value)
          }
          value={value || undefined}
        >
          <Option value="">Select meal</Option>
          {meals
            .filter((meal) => meal.category === "breakfast")
            .map((meal) => (
              <Option key={meal._id} value={meal._id}>
                {meal.name}
              </Option>
            ))}
        </Select>
      ),
    },
    {
      title: "Lunch",
      dataIndex: "lunch",
      key: "lunch",
      render: (value, record) => (
        <Select
          style={{ width: 120 }}
          onChange={(value) => handleMealSelection(record.date, "lunch", value)}
          value={value || undefined}
        >
          <Option value="">Select meal</Option>
          {meals // Filter meals based on category
            .filter((meal) => meal.category === "lunch")
            .map((meal) => (
              <Option key={meal._id} value={meal._id}>
                {meal.name}
              </Option>
            ))}
        </Select>
      ),
    },
    {
      title: "Dinner",
      dataIndex: "dinner",
      key: "dinner",
      render: (value, record) => (
        <Select
          style={{ width: 120 }}
          onChange={(value) =>
            handleMealSelection(record.date, "dinner", value)
          }
          value={value || undefined}
        >
          <Option value="">Select meal</Option>
          {meals
            .filter((meal) => meal.category === "dinner")
            .map((meal) => (
              <Option key={meal._id} value={meal._id}>
                {meal.name}
              </Option>
            ))}
        </Select>
        
      ),
    },
  ];

  return (
    <Modal
      title="Meal Planner"
      open={visible}
      onCancel={onClose}
      width={800}
      footer={[
        <Button key="cancel" onClick={onClose}>
          Cancel
        </Button>,
        <Button
          key="save"
          type="primary"
          onClick={handleSavePlan}
          loading={loading}
          disabled={mealPlan.length === 0}
        >
          Save Meal Plan
        </Button>,
      ]}
    >
      <Spin spinning={fetchingPlan}>
        <RangePicker
          value={dateRange}
          onChange={handleDateRangeChange}
          style={{ marginBottom: 16 }}
        />
        {meals.length === 0 ? (
          <p>No meals available. Please add meals to the system first.</p>
        ) : (
          <Table
            columns={columns}
            dataSource={mealPlan}
            rowKey="date"
            pagination={false}
          />
        )}
      </Spin>
    </Modal>
  );
}

export default MealPlanner;
