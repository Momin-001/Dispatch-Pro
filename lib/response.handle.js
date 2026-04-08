import { NextResponse } from "next/server";

const successResponse = (message, data = {}) => {
  return NextResponse.json(
    { success: true, message, data },
    { status: 200 }
  );
};

const errorResponse = (message, status = 500) => {
  return NextResponse.json(
    { success: false, message },
    { status } 
  );
};

export { successResponse, errorResponse };
