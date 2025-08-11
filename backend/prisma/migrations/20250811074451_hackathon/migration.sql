-- CreateEnum
CREATE TYPE "public"."UserRole" AS ENUM ('USER', 'ADMIN');

-- CreateEnum
CREATE TYPE "public"."InputMethod" AS ENUM ('TEXT', 'VOICE', 'API');

-- CreateEnum
CREATE TYPE "public"."MatchType" AS ENUM ('EXACT_TITLE', 'SEMANTIC', 'KEYWORD', 'SYNONYM', 'FUZZY', 'FALLBACK');

-- CreateEnum
CREATE TYPE "public"."DatasetType" AS ENUM ('NCO_MASTER_DATA', 'SURVEY_DATA', 'BULK_CLASSIFICATION', 'USER_UPLOAD', 'TRAINING_DATA');

-- CreateEnum
CREATE TYPE "public"."DatasetStatus" AS ENUM ('DRAFT', 'VALIDATING', 'READY_FOR_AI', 'AI_PROCESSING', 'COMPLETED', 'ERROR', 'ARCHIVED');

-- CreateTable
CREATE TABLE "public"."users" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "role" "public"."UserRole" NOT NULL DEFAULT 'USER',
    "phone" TEXT,
    "region" TEXT,
    "language" TEXT NOT NULL DEFAULT 'en',
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."nco_codes" (
    "id" TEXT NOT NULL,
    "ncoCode" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "majorGroup" TEXT NOT NULL,
    "subMajorGroup" TEXT NOT NULL,
    "minorGroup" TEXT NOT NULL,
    "unitGroup" TEXT NOT NULL,
    "sector" TEXT,
    "skillLevel" TEXT,
    "educationLevel" TEXT,
    "keywords" TEXT[],
    "synonyms" TEXT[],
    "version" TEXT NOT NULL DEFAULT 'NCO-2015',
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "isVerified" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "nco_codes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."search_history" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "query" TEXT NOT NULL,
    "language" TEXT NOT NULL DEFAULT 'en',
    "inputMethod" "public"."InputMethod" NOT NULL DEFAULT 'TEXT',
    "sessionId" TEXT,
    "userAgent" TEXT,
    "ipAddress" TEXT,
    "processingTime" INTEGER,
    "totalResults" INTEGER NOT NULL DEFAULT 0,
    "aiServiceStatus" TEXT NOT NULL DEFAULT 'success',
    "searchedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "search_history_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."search_results" (
    "id" TEXT NOT NULL,
    "searchId" TEXT NOT NULL,
    "ncoCodeId" TEXT NOT NULL,
    "relevanceScore" DOUBLE PRECISION NOT NULL,
    "confidenceScore" DOUBLE PRECISION NOT NULL,
    "rank" INTEGER NOT NULL,
    "matchType" "public"."MatchType" NOT NULL,
    "matchedKeywords" TEXT[],
    "explanation" TEXT,
    "wasSelected" BOOLEAN NOT NULL DEFAULT false,
    "wasViewed" BOOLEAN NOT NULL DEFAULT false,
    "viewedAt" TIMESTAMP(3),
    "selectedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "search_results_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."search_feedback" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "searchId" TEXT NOT NULL,
    "selectedCodeId" TEXT,
    "rating" INTEGER,
    "isCorrect" BOOLEAN,
    "wasHelpful" BOOLEAN,
    "manualCodeId" TEXT,
    "comments" TEXT,
    "correctionReason" TEXT,
    "suggestedKeywords" TEXT[],
    "reportedIssue" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "search_feedback_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."datasets" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "type" "public"."DatasetType" NOT NULL,
    "status" "public"."DatasetStatus" NOT NULL DEFAULT 'DRAFT',
    "originalFileName" TEXT,
    "fileSize" INTEGER,
    "fileUrl" TEXT,
    "mimeType" TEXT,
    "totalRecords" INTEGER NOT NULL DEFAULT 0,
    "processedRecords" INTEGER NOT NULL DEFAULT 0,
    "errorRecords" INTEGER NOT NULL DEFAULT 0,
    "aiProcessingStatus" TEXT,
    "aiProcessingStarted" TIMESTAMP(3),
    "aiProcessingCompleted" TIMESTAMP(3),
    "createdBy" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "datasets_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."data_records" (
    "id" TEXT NOT NULL,
    "datasetId" TEXT NOT NULL,
    "originalData" JSONB NOT NULL,
    "processedData" JSONB,
    "isProcessed" BOOLEAN NOT NULL DEFAULT false,
    "hasErrors" BOOLEAN NOT NULL DEFAULT false,
    "errorMessage" TEXT,
    "suggestedCodeId" TEXT,
    "confidenceScore" DOUBLE PRECISION,
    "alternativeCodes" JSONB,
    "manualCodeId" TEXT,
    "isVerified" BOOLEAN NOT NULL DEFAULT false,
    "verifiedBy" TEXT,
    "verifiedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "processedAt" TIMESTAMP(3),

    CONSTRAINT "data_records_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."system_config" (
    "id" TEXT NOT NULL,
    "key" TEXT NOT NULL,
    "value" TEXT NOT NULL,
    "description" TEXT,
    "category" TEXT NOT NULL DEFAULT 'general',
    "dataType" TEXT NOT NULL DEFAULT 'string',
    "isPublic" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "system_config_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."audit_logs" (
    "id" TEXT NOT NULL,
    "userId" TEXT,
    "action" TEXT NOT NULL,
    "resourceType" TEXT NOT NULL,
    "resourceId" TEXT,
    "method" TEXT,
    "endpoint" TEXT,
    "userAgent" TEXT,
    "ipAddress" TEXT,
    "metadata" JSONB,
    "success" BOOLEAN NOT NULL DEFAULT true,
    "errorMessage" TEXT,
    "duration" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "audit_logs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."search_analytics" (
    "id" TEXT NOT NULL,
    "date" DATE NOT NULL,
    "hour" INTEGER,
    "language" TEXT NOT NULL,
    "userRole" TEXT,
    "region" TEXT,
    "inputMethod" TEXT,
    "totalSearches" INTEGER NOT NULL DEFAULT 0,
    "uniqueUsers" INTEGER NOT NULL DEFAULT 0,
    "avgResponseTime" DOUBLE PRECISION,
    "successRate" DOUBLE PRECISION,
    "avgConfidenceScore" DOUBLE PRECISION,
    "aiServiceUptime" DOUBLE PRECISION,
    "topQueries" JSONB,
    "topNCOCodes" JSONB,
    "avgUserRating" DOUBLE PRECISION,
    "feedbackCount" INTEGER NOT NULL DEFAULT 0,
    "correctionRate" DOUBLE PRECISION,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "search_analytics_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."api_requests" (
    "id" TEXT NOT NULL,
    "endpoint" TEXT NOT NULL,
    "method" TEXT NOT NULL,
    "requestData" JSONB,
    "statusCode" INTEGER,
    "responseData" JSONB,
    "responseTime" INTEGER,
    "userId" TEXT,
    "searchId" TEXT,
    "datasetId" TEXT,
    "success" BOOLEAN NOT NULL DEFAULT false,
    "errorMessage" TEXT,
    "retryCount" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "api_requests_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "public"."users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "nco_codes_ncoCode_key" ON "public"."nco_codes"("ncoCode");

-- CreateIndex
CREATE INDEX "nco_codes_ncoCode_idx" ON "public"."nco_codes"("ncoCode");

-- CreateIndex
CREATE INDEX "nco_codes_majorGroup_subMajorGroup_minorGroup_unitGroup_idx" ON "public"."nco_codes"("majorGroup", "subMajorGroup", "minorGroup", "unitGroup");

-- CreateIndex
CREATE INDEX "nco_codes_sector_idx" ON "public"."nco_codes"("sector");

-- CreateIndex
CREATE INDEX "nco_codes_keywords_idx" ON "public"."nco_codes"("keywords");

-- CreateIndex
CREATE INDEX "search_history_userId_searchedAt_idx" ON "public"."search_history"("userId", "searchedAt");

-- CreateIndex
CREATE INDEX "search_history_language_idx" ON "public"."search_history"("language");

-- CreateIndex
CREATE INDEX "search_history_sessionId_idx" ON "public"."search_history"("sessionId");

-- CreateIndex
CREATE INDEX "search_results_searchId_rank_idx" ON "public"."search_results"("searchId", "rank");

-- CreateIndex
CREATE INDEX "search_results_relevanceScore_idx" ON "public"."search_results"("relevanceScore");

-- CreateIndex
CREATE UNIQUE INDEX "search_feedback_searchId_key" ON "public"."search_feedback"("searchId");

-- CreateIndex
CREATE INDEX "search_feedback_rating_idx" ON "public"."search_feedback"("rating");

-- CreateIndex
CREATE INDEX "search_feedback_isCorrect_idx" ON "public"."search_feedback"("isCorrect");

-- CreateIndex
CREATE INDEX "data_records_datasetId_isProcessed_idx" ON "public"."data_records"("datasetId", "isProcessed");

-- CreateIndex
CREATE INDEX "data_records_isVerified_idx" ON "public"."data_records"("isVerified");

-- CreateIndex
CREATE UNIQUE INDEX "system_config_key_key" ON "public"."system_config"("key");

-- CreateIndex
CREATE INDEX "audit_logs_userId_createdAt_idx" ON "public"."audit_logs"("userId", "createdAt");

-- CreateIndex
CREATE INDEX "audit_logs_action_createdAt_idx" ON "public"."audit_logs"("action", "createdAt");

-- CreateIndex
CREATE INDEX "audit_logs_resourceType_resourceId_idx" ON "public"."audit_logs"("resourceType", "resourceId");

-- CreateIndex
CREATE INDEX "search_analytics_date_idx" ON "public"."search_analytics"("date");

-- CreateIndex
CREATE UNIQUE INDEX "search_analytics_date_hour_language_userRole_region_inputMe_key" ON "public"."search_analytics"("date", "hour", "language", "userRole", "region", "inputMethod");

-- CreateIndex
CREATE INDEX "api_requests_endpoint_createdAt_idx" ON "public"."api_requests"("endpoint", "createdAt");

-- CreateIndex
CREATE INDEX "api_requests_success_createdAt_idx" ON "public"."api_requests"("success", "createdAt");

-- AddForeignKey
ALTER TABLE "public"."search_history" ADD CONSTRAINT "search_history_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."search_results" ADD CONSTRAINT "search_results_searchId_fkey" FOREIGN KEY ("searchId") REFERENCES "public"."search_history"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."search_results" ADD CONSTRAINT "search_results_ncoCodeId_fkey" FOREIGN KEY ("ncoCodeId") REFERENCES "public"."nco_codes"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."search_feedback" ADD CONSTRAINT "search_feedback_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."search_feedback" ADD CONSTRAINT "search_feedback_searchId_fkey" FOREIGN KEY ("searchId") REFERENCES "public"."search_history"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."search_feedback" ADD CONSTRAINT "search_feedback_selectedCodeId_fkey" FOREIGN KEY ("selectedCodeId") REFERENCES "public"."nco_codes"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."datasets" ADD CONSTRAINT "datasets_createdBy_fkey" FOREIGN KEY ("createdBy") REFERENCES "public"."users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."data_records" ADD CONSTRAINT "data_records_datasetId_fkey" FOREIGN KEY ("datasetId") REFERENCES "public"."datasets"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."audit_logs" ADD CONSTRAINT "audit_logs_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
