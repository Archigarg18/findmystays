-- CreateTable
CREATE TABLE `Payment` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `upiTransactionId` VARCHAR(191) NULL,
    `amount` DOUBLE NOT NULL,
    `status` VARCHAR(191) NOT NULL DEFAULT 'pending',
    `bookingId` INTEGER NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `UserFilter` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `userId` INTEGER NOT NULL,
    `filterName` VARCHAR(191) NOT NULL,
    `filterValue` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Payment` ADD CONSTRAINT `Payment_bookingId_fkey` FOREIGN KEY (`bookingId`) REFERENCES `Booking`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `UserFilter` ADD CONSTRAINT `UserFilter_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- Custom SQL

-- 1. View: PaymentDetailsView
CREATE VIEW PaymentDetailsView AS
SELECT
    p.id AS PaymentId,
    p.amount,
    p.status,
    u.name AS UserName,
    u.email AS UserEmail
FROM Payment p
JOIN Booking b ON p.bookingId = b.id
JOIN User u ON b.userId = u.id;

-- 2. Function: GetTotalUserSpend
CREATE FUNCTION GetTotalUserSpend(userIdInput INT) RETURNS DOUBLE
DETERMINISTIC
READS SQL DATA
BEGIN
    DECLARE totalSpend DOUBLE;
    SELECT SUM(amount) INTO totalSpend
    FROM Payment p
    JOIN Booking b ON p.bookingId = b.id
    WHERE b.userId = userIdInput AND p.status = 'completed';
    RETURN IFNULL(totalSpend, 0);
END;

-- 3. Procedure with Cursor: ArchiveOldFilters
CREATE PROCEDURE ArchiveOldFilters()
BEGIN
    DECLARE done INT DEFAULT FALSE;
    DECLARE fId INT;
    DECLARE cur1 CURSOR FOR SELECT id FROM UserFilter WHERE createdAt < DATE_SUB(NOW(), INTERVAL 30 DAY);
    DECLARE CONTINUE HANDLER FOR NOT FOUND SET done = TRUE;

    OPEN cur1;

    read_loop: LOOP
        FETCH cur1 INTO fId;
        IF done THEN
            LEAVE read_loop;
        END IF;
        
        UPDATE UserFilter SET filterValue = CONCAT(filterValue, ' [ARCHIVED]') WHERE id = fId;
    END LOOP;

    CLOSE cur1;
END;
