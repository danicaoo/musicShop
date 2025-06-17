-- Функция обновления инвентаря при продажах
CREATE OR REPLACE FUNCTION update_inventory_on_sale()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE "Inventory"
    SET 
        current_year_sales = current_year_sales + NEW.quantity,
        unsold = unsold - NEW.quantity
    WHERE id = NEW.inventory_id;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Триггер для обработки новых продаж
CREATE TRIGGER sale_trigger
AFTER INSERT ON "Sale"
FOR EACH ROW EXECUTE FUNCTION update_inventory_on_sale();