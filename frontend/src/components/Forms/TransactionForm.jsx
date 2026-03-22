import React from "react";
import { useSelector } from "react-redux";

import {
  Button,
  DatePicker,
  Input,
  Select,
  SelectItem,
  Textarea,
} from "@nextui-org/react";
import { Title, Category, Add, Amount } from "../../utils/Icons";
import { getCurrencySymbol } from "../../utils/currencyFormatter";

const TransactionForm = ({
  categories,
  formData,
  button,
  btnColor,
  hasErrors,
  errors,
  isLoading,
  handleOnChange,
  handleDateChange,
  handleSubmit,
}) => {
  const { title, amount, description, category, date } = formData;
  const user = useSelector((state) => state.auth.user);
  const currencySymbol = getCurrencySymbol(user?.currency);

  return (
    <form className="surface-card flex flex-col justify-center items-center space-y-4 w-full lg:w-[45%] p-5 md:p-6">
      <Input
        label="Title"
        placeholder="Enter the title"
        name="title"
        value={title}
        onChange={handleOnChange}
        isInvalid={!!errors.title}
        errorMessage={errors?.title}
        startContent={<Title />}
        className="text-gray-500"
        classNames={{
          inputWrapper:
            "premium-input rounded-xl shadow-sm group-data-[focus=true]:bg-white dark:group-data-[focus=true]:bg-slate-900",
        }}
      />
      <Input
        type="number"
        label="Amount"
        placeholder="Enter the amount"
        name="amount"
        value={amount}
        onChange={handleOnChange}
        isInvalid={!!errors.amount}
        errorMessage={errors?.amount}
        startContent={
          <div className="flex items-center gap-1">
            <Amount />
            <span className="text-sm font-semibold text-gray-600">
              {currencySymbol}
            </span>
          </div>
        }
        className="text-gray-500"
        classNames={{
          inputWrapper:
            "premium-input rounded-xl shadow-sm group-data-[focus=true]:bg-white dark:group-data-[focus=true]:bg-slate-900",
        }}
      />
      <div className="w-full grid grid-cols-2 gap-x-2">
        <Select
          name="category"
          label="Category"
          placeholder="Select the category"
          value={category}
          onChange={handleOnChange}
          isInvalid={!!errors.category}
          errorMessage={errors?.category}
          startContent={<Category />}
          className="text-gray-500"
          classNames={{
            trigger:
              "premium-input rounded-xl shadow-sm group-data-[focus=true]:bg-white dark:group-data-[focus=true]:bg-slate-900",
          }}
        >
          {categories.map((category) => (
            <SelectItem key={category.value} value={category.value}>
              {category.label}
            </SelectItem>
          ))}
        </Select>
        <DatePicker
          name="date"
          label="Select the date"
          value={date}
          onChange={handleDateChange}
          isInvalid={!!errors.date}
          errorMessage={errors?.date}
          classNames={{
            inputWrapper:
              "premium-input rounded-xl shadow-sm group-data-[focus=true]:bg-white dark:group-data-[focus=true]:bg-slate-900",
          }}
        />
      </div>
      <Textarea
        name="description"
        label="Description"
        placeholder="Enter your description"
        maxRows={4}
        value={description}
        onChange={handleOnChange}
        isInvalid={!!errors.description}
        errorMessage={errors?.description}
        classNames={{
          inputWrapper:
            "premium-input rounded-xl shadow-sm group-data-[focus=true]:bg-white dark:group-data-[focus=true]:bg-slate-900",
        }}
      />
      <Button
        color={btnColor}
        startContent={<Add />}
        className="premium-button text-white rounded-xl"
        isLoading={isLoading}
        onClick={handleSubmit}
        isDisabled={
          !title || !amount || !category || !date || !description || hasErrors
        }
      >
        {button}
      </Button>
    </form>
  );
};

export default TransactionForm;
